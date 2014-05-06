cancelUnless(me, "You must be logged in to create a company user link", 401);

dpd.companytouser.get({userId: this.userId, companyId: this.companyId}, function(data) {
    if (data.length > 0) {
        cancel();
    }
});
this.creatorId = me.id;
this.creationDate = new Date().getTime();
this.lastModification = new Date().getTime();
//if (this.rightsLevel === "") {
//    this.rightsLevel = 0;
//}