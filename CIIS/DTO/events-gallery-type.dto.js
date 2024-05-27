class EventsGalleryTypeDTO{
    constructor(title,description,_anio,items){
        this.title=title;
        this.description=description;
        this.anio=_anio;
        this.items=items;
    }
}


class ItemsGalleryDTO{
    constructor(image,name){
        this.image=image;
        this.name=name;
    }
}

module.exports={
    EventsGalleryTypeDTO,
    ItemsGalleryDTO
}