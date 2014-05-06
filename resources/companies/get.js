cancelUnless(me, "You must be logged in to view the companies", 401);

if (typeof query.includeCompanytouser !== "undefined") {
    dpd.companytouser.get({companyId: this.id, userId: query.includeCompanytouser}, function(result) {
        this.companytouser = result;
    });
}   