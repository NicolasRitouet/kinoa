cancelUnless(me, "You must be logged in to get a company", 401);
if (query.includeCompany) {
    dpd.companies.get({id: this.companyId}, function(company) {
        this.company = company;
    });
}