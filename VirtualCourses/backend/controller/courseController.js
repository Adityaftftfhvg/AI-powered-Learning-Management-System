import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../model/courseModel.js"
import Order from "../model/orderModel.js"
export const CreateCourse = async (req,res) => {
    try {
 const {title,category,description} = req.body
        if(!title || !category){
            return res.status(400).json({message:"title or Category is required"})
        }
 const course = await Course.create(
            {
                title,
                category,
                description,
                creator:req.userId
            }
        )
     return res.status(201).json(course)
    } catch (error) {
  return res.status(500).json({message:`CreateCourse error ${error}`})
    } 
}

export const getPublishedCourses = async (req,res) => {
    try {
     const courses = await Course.find({isPublished:true})
 return res.status(200).json(courses)
    } catch (error) {
    return res.status(500).json({message:`failed to find isPublished Courses  ${error}`}) 
    }
}

export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.userId
 const courses = await Course.find({creator:userId})
        return res.status(200).json(courses)
    } catch (error) {
         return res.status(500).json({message:`failed to get creator Courses  ${error}`}) 
    }
}

export const editCourse = async (req,res) => {
    try {
        const {courseId} = req.params
  const {title,subTitle, description, category, level,isPublished,price} = req.body
      let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
  let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course not found"})
    }
 const updateData = {title,subTitle, description, category, level,isPublished,price}
        if(thumbnail){
            updateData.thumbnail = thumbnail
        }
     course = await Course.findByIdAndUpdate(courseId,updateData,{new:true})
  return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`failed to edit Course ${error}`}) 
    }
}

export const getCourseById = async (req,res) => {
    try {
 const {courseId} = req.params
     let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course not found"})
        }
 return res.status(200).json(course)
    } catch (error) {
  return res.status(500).json({message:`failed to get Course by Id ${error}`}) 
    }
}

export const removeCourse = async (req,res) => {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
  if(!course){
            return res.status(400).json({message:"Course not found"})
        }
        course = await Course.findByIdAndDelete(courseId)
        return res.status(200).json({message: "Course removed"})
  } catch (error) {
        return res.status(500).json({message:`failed to remove Course ${error}`}) 
    }
}
export const aiSearchCourses = async (req, res) => {
    try {
        const { query } = req.body
        if (!query || !query.trim()) {
            return res.status(400).json({ message: "Search query is required" })
        }

        const courses = await Course.find({ isPublished: true })
            .select("title subTitle description category level price thumbnail")

        if (courses.length === 0) {
            return res.status(200).json({ results: [] })
        }

        const catalog = courses.map((c) => ({
            id: c._id.toString(),
            title: c.title,
            subTitle: c.subTitle || "",
            description: (c.description || "").slice(0, 300),
            category: c.category,
            level: c.level || ""
        }))

        const systemPrompt = `You are a course-matching assistant for an online learning platform.
You will be given a user's search query and a JSON catalog of published courses.
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{"results":[{"id":"<course id>","reason":"<one short sentence, under 15 words, on why it matches>"}]}
Rules:
- Only include courses that are genuinely relevant to the query's intent (skills, topic, goal, or level implied).
- Order results from most to least relevant.
- If nothing matches, return {"results":[]}.
- Never invent an id that isn't in the catalog.
- Return at most 8 results.`

        const userPrompt = `User query: "${query}"\n\nCourse catalog:\n${JSON.stringify(catalog)}`

        const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.3,
                max_completion_tokens: 1024
            })
        })

        if (!aiResponse.ok) {
            const errText = await aiResponse.text()
            console.log("Groq API error:", errText)
            return res.status(502).json({ message: "AI search is temporarily unavailable" })
        }

        const aiData = await aiResponse.json()
        const rawText = aiData?.choices?.[0]?.message?.content || "{}"
        const cleaned = rawText.replace(/```json|```/g, "").trim()

        let parsed
        try {
            parsed = JSON.parse(cleaned)
        } catch (parseErr) {
            console.log("Failed to parse AI response:", rawText)
            return res.status(502).json({ message: "AI search returned an unexpected response" })
        }

        const matchedIds = (parsed.results || []).map((r) => r.id)
        const reasonById = {}
        ;(parsed.results || []).forEach((r) => { reasonById[r.id] = r.reason })

        const matchedCourses = matchedIds
            .map((id) => courses.find((c) => c._id.toString() === id))
            .filter(Boolean)
            .map((c) => ({ ...c.toObject(), aiReason: reasonById[c._id.toString()] || "" }))

        return res.status(200).json({ results: matchedCourses })
    } catch (error) {
        return res.status(500).json({ message: `aiSearchCourses error ${error}` })
    }
}
export const enrollInCourse = async (req,res) => {
    try {
     const {courseId} = req.params
        const userId = req.userId

       const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        // Prevent duplicate enrollment
        if(course.enrolledStudent.includes(userId)){
            return res.status(400).json({message:"Already enrolled in this course"})
        }

        course.enrolledStudent.push(userId)
        await course.save()

        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`enrollInCourse error ${error}`})
    }
}
export const getEducatorStats = async (req, res) => {
    try {
       const userId = req.userId
  const courses = await Course.find({ creator: userId })
      const courseIds = courses.map((c) => c._id)

       
     const paidOrders = await Order.find({ course: { $in: courseIds }, status: "paid" })
  const totalEarnings = paidOrders.reduce((sum, order) => sum + order.amount, 0) / 100 // paise -> rupees

       const uniqueStudentIds = new Set()
        courses.forEach((course) => {
            course.enrolledStudent.forEach((studentId) => uniqueStudentIds.add(studentId.toString()))
        })

      const totalLectures = courses.reduce((sum, course) => sum + course.lectures.length, 0)

   const courseBreakdown = courses.map((course) => ({
            id: course._id,
            title: course.title,
            lectures: course.lectures.length,
            students: course.enrolledStudent.length,
            isPublished: course.isPublished
        }))

  return res.status(200).json({
            totalCourses: courses.length,
            totalLectures,
            totalStudents: uniqueStudentIds.size,
            totalEarnings,
            courses: courseBreakdown
        })
    } catch (error) {
     return res.status(500).json({ message: `getEducatorStats error ${error}` })
    }
}