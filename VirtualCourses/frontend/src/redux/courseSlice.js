import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    name: "course",
    initialState: {
        creatorCourses: []
    },
    reducers: {
        setCreatorCourses: (state, action) => {
            state.creatorCourses = action.payload
        },
        addCourse: (state, action) => {
            state.creatorCourses.push(action.payload)
        },
        updateCourseInList: (state, action) => {
            const index = state.creatorCourses.findIndex(c => c._id === action.payload._id)
            if (index !== -1) {
                state.creatorCourses[index] = action.payload
            }
        },
        removeCourseFromList: (state, action) => {
            state.creatorCourses = state.creatorCourses.filter(c => c._id !== action.payload)
        }
    }
})

export const { setCreatorCourses, addCourse, updateCourseInList, removeCourseFromList } = courseSlice.actions
export default courseSlice.reducer