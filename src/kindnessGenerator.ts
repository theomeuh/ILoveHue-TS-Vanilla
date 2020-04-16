export function victoryMessageGenerator() {
    const victoryMessage: string[] = [
        "You are a great, incredible, prolific mage of color.",
        "You are a colorful sunrise.",
        "You are a magnificent source of light.",
        "You are a great, shining star.",
        "You are an iridescent moonbeam.",
        "You are a shimmering unicorn.",
        "You are an illustrious butterfly.",
    ]

    return victoryMessage[Math.floor(Math.random() * victoryMessage.length)]
}