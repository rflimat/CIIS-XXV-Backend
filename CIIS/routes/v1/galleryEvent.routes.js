const {Router}=require("express");
const routerGalleryEvent=Router();
const {getGalleryEvents}=require("../../controllers/galleryEvent.controller");

routerGalleryEvent.route('/gallery-event')
.get(getGalleryEvents);


module.exports=routerGalleryEvent;