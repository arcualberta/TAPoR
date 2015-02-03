# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
AttributeType.create(name: "Background processing", possible_values: "Doesn't run in background|Not applicable|Runs in background", is_multiple: false);
AttributeType.create(name: "Warning", possible_values: "Complex and difficult|Limited uses|Prototype|Still in development|Time consuming", is_multiple: true);


User.create(uid: 0,
	uid: "103834776938893478547",
	provider: "google_oauth2",
	name: "Omar Rodriguez-Arenas",
	is_email_publishable: 0,
	image_url: "https://lh4.googleusercontent.com/-B2KJ9dM2vio/AAAAAAAAAAI/AAAAAAAAAFI/XQjP76nNCNE/photo.jpg?sz=50",
	is_blocked: 0,
	is_admin: 1	
)



# prev version

User.create(uid: 1, id: 8, provider: 'google_oauth2', login: 'lgoddard@ualberta.ca', is_admin:1, email:'lgoddard@ualberta.ca', name:'Lisa Goddard', is_email_publishable: 0);
User.create(uid: 2, id: 9, provider: 'google_oauth2', login: 'amy.dyrbye@gmail.com', is_admin:1, email:'amy.dyrbye@gmail.com', name:'Amy Dyrbye', is_email_publishable: 0);
User.create(uid: 3, id: 15, provider: 'google_oauth2', login: 'grockwel@ualberta.ca', is_admin:1, email:'geoffrey.rockwell@ualberta.ca', name:'Geoffrey Rockwell', is_email_publishable: 0);
User.create(uid: 4, id: 17, provider: 'google_oauth2', login: 'recharti@ualberta.ca', is_admin:1, email:'recharti@ualberta.ca', name:'Ryan Chartier', is_email_publishable: 0);
User.create(uid: 5, id: 21, provider: 'google_oauth2', login: 'mpm1@ualberta.ca', is_admin:1, email:'mpm1@ualberta.ca', name:'Mark McKellar', is_email_publishable: 0);
User.create(uid: 6, id: 23, provider: 'google_oauth2', login: 'ranaweer@ualberta.ca', is_admin:1, email:'ranaweer@ualberta.ca', name:'Kamal Ranaweera', is_email_publishable: 0);
User.create(uid: 7, id: 25, provider: 'twitter', login: 'McKellarMark', is_admin:0, email:'McKellarMark@twitter.com', name:'Mark McKellar', is_email_publishable: 0);
User.create(uid: 8, id: 30, provider: 'google_oauth2', login: 'pib@northwestern.edu', is_admin:0, email:'pib@northwestern.edu', name:'Philip Burns', is_email_publishable: 0);
User.create(uid: 9, id: 45, provider: 'google_oauth2', login: 'namer.fiammetta@gmail.com', is_admin:0, email:'namer.fiammetta@gmail.com', name:'Fiammetta Namer', is_email_publishable: 0);
User.create(uid: 10, id: 72, provider: 'google_oauth2', login: 'dergache@ualberta.ca', is_admin:0, email:'dergache@ualberta.ca', name:'Yelena Dergacheva', is_email_publishable: 0);
User.create(uid: 11, id: 166, provider: 'google_oauth2', login: 'samehov@gmail.com', is_admin:0, email:'samehov@gmail.com', name:'Sameh Madbouly', is_email_publishable: 0);
User.create(uid: 12, id: 175, provider: 'google_oauth2', login: 'psh172@gmail.com', is_admin:0, email:'psh172@gmail.com', name:'P?ena Kova?i?', is_email_publishable: 0);
User.create(uid: 13, id: 192, provider: 'yahoo', login: 'rfd_0954@yahoo.com', is_admin:0, email:'rfd_0954@yahoo.com', name:'rfd_0954', is_email_publishable: 0);
User.create(uid: 14, id: 211, provider: 'google_oauth2', login: 'athrofa@gmail.com', is_admin:0, email:'athrofa@gmail.com', name:'PWT T.', is_email_publishable: 0);
User.create(uid: 15, id: 246, provider: 'google_oauth2', login: '112470672@umail.ucc.ie', is_admin:0, email:'112470672@umail.ucc.ie', name:'Saoirse Irene Mccabe', is_email_publishable: 0);
User.create(uid: 16, id: 256, provider: 'yahoo', login: 'sital_pal@yahoo.com', is_admin:0, email:'sital_pal@yahoo.com', name:'Sital Kumar Pal', is_email_publishable: 0);
User.create(uid: 17, id: 278, provider: 'google_oauth2', login: 'mr.maghami@gmail.com', is_admin:0, email:'mr.maghami@gmail.com', name:'Mohamad Maghami', is_email_publishable: 0);
User.create(uid: 18, id: 284, provider: 'google_oauth2', login: 'lorcshazam@gmail.com', is_admin:0, email:'lorcshazam@gmail.com', name:'Lorc Shazam', is_email_publishable: 0);
User.create(uid: 19, id: 299, provider: 'twitter', login: 'ArisXanthos', is_admin:0, email:'ArisXanthos@twitter.com', name:'Aris Xanthos', is_email_publishable: 0);
User.create(uid: 20, id: 307, provider: 'google_oauth2', login: 'my.point.of.view.2023@gmail.com', is_admin:0, email:'my.point.of.view.2023@gmail.com', name:'bak?? a??m', is_email_publishable: 0);
User.create(uid: 21, id: 309, provider: 'google_oauth2', login: 'dr.misekfalkoff@gmail.com', is_admin:0, email:'dr.misekfalkoff@gmail.com', name:'Linda Misek-Falkoff', is_email_publishable: 1);
User.create(uid: 22, id: 310, provider: 'google_oauth2', login: 'janinajacke@gmail.com', is_admin:0, email:'janinajacke@gmail.com', name:'janinajacke .', is_email_publishable: 0);
User.create(uid: 23, id: 316, provider: 'google_oauth2', login: 'sudarshankanade@gmail.com', is_admin:0, email:'sudarshankanade@gmail.com', name:'Sudarshan Kanade', is_email_publishable: 0);
User.create(uid: 24, id: 372, provider: 'google_oauth2', login: 'hyperstudio@mit.edu', is_admin:0, email:'hyperstudio@mit.edu', name:' ', is_email_publishable: 0);
User.create(uid: 25, id: 406, provider: 'google_oauth2', login: 'thomascbernhart@gmail.com', is_admin:0, email:'thomascbernhart@gmail.com', name:'Thomas Bernhart', is_email_publishable: 0);
User.create(uid: 26, id: 528, provider: 'google_oauth2', login: 'clementlevallois@gmail.com', is_admin:0, email:'clementlevallois@gmail.com', name:'Clement Levallois', is_email_publishable: 0);
User.create(uid: 27, id: 539, provider: 'google_oauth2', login: 'jyotithomas2012@gmail.com', is_admin:0, email:'jyotithomas2012@gmail.com', name:'Jyoti Thomas', is_email_publishable: 0);
User.create(uid: 28, id: 569, provider: 'twitter', login: 'GBKB1', is_admin:0, email:'GBKB1@twitter.com', name:'GBKB', is_email_publishable: 0);
User.create(uid: 29, id: 646, provider: 'twitter', login: 'CLARIN_ES_LAB', is_admin:0, email:'iulatrl@upf.edu', name:'IULA-UPF CCC', is_email_publishable: 0);
User.create(uid: 30, id: 698, provider: 'yahoo', login: 'zipzoog@yahoo.com', is_admin:0, email:'zipzoog@yahoo.com', name:'', is_email_publishable: 0);
User.create(uid: 31, id: 705, provider: 'yahoo', login: 'mis_miz@hotmail.com', is_admin:0, email:'mis_miz@hotmail.com', name:'Shawnaughseey Bea', is_email_publishable: 0);
