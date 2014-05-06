cancelUnless(me, "You must be logged in to create a link between a company and a taxe", 401);

this.creatorId = me.id;
this.creationDate = new Date().getTime();
this.lastModification = new Date().getTime();