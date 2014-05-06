cancelUnless(me, "You must be logged in to delete a company", 401);

dpd.companytouser.get({companyId: this.id}, function(companyToUsers) {
    for (var index in companyToUsers) {
        dpd.companytouser.del(companyToUsers[index]);
    }
});
dpd.companytocontact.get({companyId: this.id}, function(companytocontacts) {
    for (var index in companytocontacts) {
        dpd.companytocontact.del(companytocontacts[index]);
    }
});
dpd.companytotaxe.get({companyId: this.id}, function(companytotaxes) {
    for (var index in companytotaxes) {
        dpd.companytotaxe.del(companytotaxes[index]);
    }
});