class ReservationDTO{
    constructor(numvoucher,filevoucher,statusRegister,user,event,pricetypeattendee,active){
        this.num_voucher=numvoucher;
        this.dir_voucher=filevoucher;
        this.active=active;
        this.enrollment_status=statusRegister;
        this.user_id=user;
        this.event_id=event;
        this.price_type_attendee_id=pricetypeattendee;
    }
}

module.exports=ReservationDTO;