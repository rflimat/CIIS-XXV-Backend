class TopicDTO {
    constructor(name, description, is_active) {
        this.name_topic = name
        this.description_topic = description
        this.is_active_topic = is_active
    }
    get view() {
        return {
            name: this.name_topic,
            description: this.description_topic,
            is_active: this.is_active_topic,
        }
    }
}

module.exports = TopicDTO;