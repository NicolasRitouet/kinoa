// cancelUnless(me, "You must be logged in to view a company user link", 401);

if(query.includeCompany) {
  dpd.companies.get({id: this.companyId}, function(company) {
    this.company = company;
  });
}
if (query.includeUser) {
    dpd.users.get({id: this.userId}, function(user) {
        this.user = user;
    });
}