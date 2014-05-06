cancelUnless(me, "You must be logged in to create a todo", 401);
if(query.includeCompany) {
  dpd.companies.get({id: this.companyId, includeCompanytouser:query.includeCompanytouser}, function(company) {
    this.company = company;
  });
}
if(query.includeTaxe) {
  dpd.taxes.get({id: this.taxeId}, function(user) {
    this.taxe = user;
  });
}