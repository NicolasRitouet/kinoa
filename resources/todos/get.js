cancelUnless(me, "You must be logged in to view a todo list", 401);

if(query.includeCompany) {
  dpd.companies.get({id: this.companyId, includeCompanytouser:query.includeCompanytouser}, function(company) {
    this.company = company;
  });
}
if(query.includeAssignedUser) {
  dpd.users.get({id: this.assignedId}, function(user) {
    this.assignedUser = user;
  });
}
if(query.includeCreator) {
  dpd.users.get({id: this.creatorId}, function(user) {
    this.creator = user;
  });
}