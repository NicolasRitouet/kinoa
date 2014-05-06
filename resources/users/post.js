cancelUnless(me, "You must be logged in to create a contact", 401);

this.creatorId = me.id;
this.creationDate = new Date().getTime();
this.lastModification = new Date().getTime();