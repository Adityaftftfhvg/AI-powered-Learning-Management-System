import Certificate from "../model/certificateModel.js"

export const getMyCertificates = async (req, res) => {
    try {
        const userId = req.userId
        const certificates = await Certificate.find({ user: userId })
            .populate("course", "title category level")
            .populate("user", "name email")
            .sort({ issuedAt: -1 })

        return res.status(200).json(certificates)
    } catch (error) {
        return res.status(500).json({ message: `getMyCertificates error ${error}` })
    }
}

export const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params
        const certificate = await Certificate.findOne({ certificateId })
            .populate("course", "title category level")
            .populate("user", "name email")

        if (!certificate) {
            return res.status(404).json({ valid: false, message: "Certificate not found" })
        }

        return res.status(200).json({ valid: true, certificate })
    } catch (error) {
        return res.status(500).json({ message: `verifyCertificate error ${error}` })
    }
}