import User from "../model/userModel.js"

const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

const isYesterday = (a, b) => {
    const yesterday = new Date(b)
    yesterday.setDate(yesterday.getDate() - 1)
    return isSameDay(a, yesterday)
}

export const recordActivity = async (userId, xpAmount = 0) => {
    const user = await User.findById(userId)
    if (!user) return null

    const now = new Date()

    if (!user.lastActiveDate) {
        user.streak = 1
    } else if (isSameDay(new Date(user.lastActiveDate), now)) {
        
    } else if (isYesterday(new Date(user.lastActiveDate), now)) {
        user.streak = (user.streak || 0) + 1
    } else {
        user.streak = 1
    }

    user.lastActiveDate = now
    user.xp = (user.xp || 0) + xpAmount

    await user.save()
    return user
}