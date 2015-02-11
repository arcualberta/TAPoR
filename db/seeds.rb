# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(
	id: 1,
	uid: 0,
	provider: "no_provider",
	name: "TAPoR",
	is_email_publishable: 0,
	image_url: "/img/tapor-profile.png",
	is_blocked: 0,
	is_admin: 0	
)


User.create(
	id: 2,
	uid: "103834776938893478547",
	provider: "google_oauth2",
	name: "Omar Rodriguez-Arenas",
	is_email_publishable: 0,
	image_url: "https://lh4.googleusercontent.com/-B2KJ9dM2vio/AAAAAAAAAAI/AAAAAAAAAFI/XQjP76nNCNE/photo.jpg?sz=50",
	is_blocked: 0,
	is_admin: 1	
)



# Users with content

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


# Attribute types

# AttributeType.create(name: "Background processing", possible_values: "Doesn't run in background|Not applicable|Runs in background", is_multiple: false);
# AttributeType.create(name: "Warning", possible_values: "Complex and difficult|Limited uses|Prototype|Still in development|Time consuming", is_multiple: true);

AttributeType.create(id: 1, name: "Type of analysis", is_multiple: true, is_required: true)
AttributeType.create(id: 2, name: "Type of license", is_multiple: true, is_required: true)
AttributeType.create(id: 3, name: "Background Processing", is_multiple: false, is_required: false)
AttributeType.create(id: 4, name: "Web Usable", is_multiple: false, is_required: false)
AttributeType.create(id: 5, name: "Ease of Use", is_multiple: false, is_required: true)
AttributeType.create(id: 6, name: "Warning", is_multiple: true, is_required: false)
AttributeType.create(id: 7, name: "Usage", is_multiple: false, is_required: false)
AttributeType.create(id: 8, name: "Tool Family", is_multiple: false, is_required: false)
AttributeType.create(id: 9, name: "Historic Tool (developed before 2005)", is_multiple: true, is_required: false)

# Attribute values


AttributeValue.create(id: 1, attribute_type_id: 1, name: "Search")
AttributeValue.create(id: 2, attribute_type_id: 1, name: "Concording")
AttributeValue.create(id: 3, attribute_type_id: 1, name: "Editing")
AttributeValue.create(id: 4, attribute_type_id: 1, name: "Visualization")
AttributeValue.create(id: 5, attribute_type_id: 1, name: "Statistical")
AttributeValue.create(id: 6, attribute_type_id: 1, name: "Text Gathering")
AttributeValue.create(id: 7, attribute_type_id: 1, name: "Text Cleaning")
AttributeValue.create(id: 8, attribute_type_id: 1, name: "Miscellaneous")
AttributeValue.create(id: 9, attribute_type_id: 2, name: "Free")
AttributeValue.create(id: 10, attribute_type_id: 2, name: "Open Source")
AttributeValue.create(id: 11, attribute_type_id: 2, name: "Commercial")
AttributeValue.create(id: 12, attribute_type_id: 2, name: "Shareware")
AttributeValue.create(id: 13, attribute_type_id: 2, name: "Creative Commons")
AttributeValue.create(id: 14, attribute_type_id: 3, name: "Runs in Background")
AttributeValue.create(id: 15, attribute_type_id: 3, name: "Doesn't Run in Background")
AttributeValue.create(id: 16, attribute_type_id: 3, name: "Not Applicable")
AttributeValue.create(id: 17, attribute_type_id: 4, name: "Run in Browser")
AttributeValue.create(id: 18, attribute_type_id: 4, name: "Software you Download and Install")
AttributeValue.create(id: 19, attribute_type_id: 4, name: "Web Application you Launch")
AttributeValue.create(id: 20, attribute_type_id: 4, name: "Other")
AttributeValue.create(id: 21, attribute_type_id: 5, name: "Very Easy")
AttributeValue.create(id: 22, attribute_type_id: 5, name: "Easy")
AttributeValue.create(id: 23, attribute_type_id: 5, name: "Moderate")
AttributeValue.create(id: 24, attribute_type_id: 5, name: "Difficult")
AttributeValue.create(id: 25, attribute_type_id: 5, name: "Very Difficult")
AttributeValue.create(id: 26, attribute_type_id: 6, name: "Prototype")
AttributeValue.create(id: 27, attribute_type_id: 6, name: "Still in Development")
AttributeValue.create(id: 28, attribute_type_id: 6, name: "Limited Uses")
AttributeValue.create(id: 29, attribute_type_id: 6, name: "Complex and Difficult")
AttributeValue.create(id: 30, attribute_type_id: 6, name: "Time Consuming")
AttributeValue.create(id: 31, attribute_type_id: 7, name: "Widely Used")
AttributeValue.create(id: 32, attribute_type_id: 7, name: "Popular")
AttributeValue.create(id: 33, attribute_type_id: 7, name: "New")
AttributeValue.create(id: 34, attribute_type_id: 7, name: "Experimental")
AttributeValue.create(id: 35, attribute_type_id: 7, name: "Limited Uses")
AttributeValue.create(id: 36, attribute_type_id: 8, name: "Voyant")
AttributeValue.create(id: 37, attribute_type_id: 8, name: "TAPoRware")
AttributeValue.create(id: 41, attribute_type_id: 9, name: "Influential")
AttributeValue.create(id: 42, attribute_type_id: 9, name: "Development sustained to present")
AttributeValue.create(id: 43, attribute_type_id: 9, name: "No longer in active development")
AttributeValue.create(id: 44, attribute_type_id: 8, name: "Stanford NLP")
AttributeValue.create(id: 45, attribute_type_id: 8, name: "Stanford Vis Group")
AttributeValue.create(id: 46, attribute_type_id: 8, name: "Stanford HCI Group")
AttributeValue.create(id: 47, attribute_type_id: 8, name: "Laurence Anthony")
AttributeValue.create(id: 48, attribute_type_id: 8, name: "SIMILE Widgets")
AttributeValue.create(id: 49, attribute_type_id: 8, name: "EURAC")
AttributeValue.create(id: 50, attribute_type_id: 8, name: "SEASR")
AttributeValue.create(id: 51, attribute_type_id: 8, name: "CNRTL")
AttributeValue.create(id: 52, attribute_type_id: 8, name: "Scholars' Lab")
AttributeValue.create(id: 53, attribute_type_id: 8, name: "CHNM")
AttributeValue.create(id: 54, attribute_type_id: 8, name: "Visualizing Literature")
AttributeValue.create(id: 55, attribute_type_id: 8, name: "Orlando")
AttributeValue.create(id: 56, attribute_type_id: 8, name: "Book Genome Project")
AttributeValue.create(id: 57, attribute_type_id: 8, name: "Digital Methods Initiative")
AttributeValue.create(id: 58, attribute_type_id: 1, name: "Programming Language")
AttributeValue.create(id: 59, attribute_type_id: 1, name: "Annotation")
AttributeValue.create(id: 60, attribute_type_id: 1, name: "Bibliographic")
AttributeValue.create(id: 61, attribute_type_id: 1, name: "Collaboration")
AttributeValue.create(id: 62, attribute_type_id: 1, name: "Comparison")
AttributeValue.create(id: 63, attribute_type_id: 1, name: "Natural Language Processing")
AttributeValue.create(id: 64, attribute_type_id: 1, name: "Network Analysis")
AttributeValue.create(id: 65, attribute_type_id: 1, name: "Publishing")
AttributeValue.create(id: 66, attribute_type_id: 1, name: "RDF")
AttributeValue.create(id: 67, attribute_type_id: 1, name: "Sentiment Analysis")
AttributeValue.create(id: 68, attribute_type_id: 1, name: "Sequence Analysis")
AttributeValue.create(id: 69, attribute_type_id: 1, name: "Social Media Analysis")


# Test tools

Tool.create(id:1, user_id: 2, name: "Tool A", url:"http://omarrodriguez.org", is_approved: true, creators_name: "Omar Rodriguez-Arenas", creators_url: "http://omarrodriguez.org", creators_email: "orodrigu@ualberta.ca", image_url: "images/tools/seed/a.png", last_updated:"2015-02-10", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque faucibus neque ac aliquet scelerisque. Pellentesque quis rutrum metus. Etiam interdum gravida velit vitae maximus. Curabitur bibendum leo eu ligula blandit tristique. Aliquam dignissim posuere rhoncus. Ut elit erat, dapibus at massa vitae, pretium fermentum nisi. Proin vitae sollicitudin dui.");
Tool.create(id:2, user_id: 2, name: "Tool B", url:"http://google.org", is_approved: true, creators_name: "Omar Rodriguez-Arenas", creators_url: "http://omarrodriguez.org", creators_email: "orodrigu@ualberta.ca", image_url: "images/tools/seed/b.png", last_updated:"2015-02-10", description: "Maecenas neque odio, dictum ac ullamcorper sed, imperdiet eget massa. In nec ex eget metus rutrum pellentesque. Quisque sed ex non augue tincidunt finibus in dictum diam. Integer in mi quis felis cursus molestie. Nunc leo mauris, auctor eu tellus at, consectetur luctus ligula. Phasellus mollis nec nunc eu vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus feugiat pharetra tempor. Aliquam pretium ex eget est consectetur, ut condimentum urna pulvinar. Sed id risus hendrerit, lacinia nibh eu, pharetra odio. Aenean placerat ipsum diam, a placerat nunc viverra in.");
Tool.create(id:3, user_id: 2, name: "Tool C", url:"http://slashdot.org", is_approved: true, creators_name: "Omar Rodriguez-Arenas", creators_url: "http://omarrodriguez.org", creators_email: "orodrigu@ualberta.ca", image_url: "images/tools/seed/c.png", last_updated:"2015-02-10", description: "Donec eleifend, risus sed tempus tincidunt, ex nisi cursus dui, in vulputate ante libero non risus. Donec et nibh id risus congue fringilla. Proin ornare turpis sagittis ante consectetur, sit amet commodo dui cursus. Donec pellentesque lectus id vulputate porttitor. Sed id imperdiet nisl, eget faucibus nisi. Integer at sapien sapien. Integer convallis enim sed dolor fringilla, eu rhoncus eros pulvinar. Integer iaculis ac lorem ac auctor. Fusce pharetra enim at nisl scelerisque ultrices. Ut fermentum metus id arcu varius suscipit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis lectus sem, mattis in leo eu, lobortis vulputate ex.");
Tool.create(id:4, user_id: 2, name: "Tool D", url:"http://www.ualberta.ca", is_approved: true, creators_name: "Omar Rodriguez-Arenas", creators_url: "http://omarrodriguez.org", creators_email: "orodrigu@ualberta.ca", image_url: "images/tools/seed/d.png", last_updated:"2015-02-10", description: "Pellentesque imperdiet convallis porta. Mauris varius, dolor et faucibus viverra, elit diam aliquam nunc, vitae pretium eros nunc eget dui. Donec quis dui vel massa fermentum lacinia vel eu nisi. Phasellus tortor nisi, iaculis id ante vel, consectetur scelerisque enim. Mauris viverra, lorem id varius convallis, magna libero ornare ipsum, quis porttitor odio lorem sit amet risus. Suspendisse nec orci sit amet tortor commodo dapibus. Donec egestas, risus et consectetur pellentesque, ante ex ornare diam, sed aliquam eros urna sit amet nisi. Nam quis urna vitae risus sodales egestas. Maecenas id odio libero. Suspendisse convallis, diam vitae posuere blandit, tellus nunc molestie elit, in lacinia velit magna sed eros. Etiam pharetra magna felis. Proin placerat tempus nulla, vitae lacinia quam semper eget. Maecenas vitae velit lectus. Donec aliquam ligula ac nisl lacinia, quis consectetur urna vehicula. Sed dignissim, purus ut faucibus volutpat, arcu neque viverra turpis, et ultricies orci dolor ac nunc. Sed lectus ligula, finibus vitae leo quis, elementum lobortis ante.");
Tool.create(id:5, user_id: 2, name: "Tool E", url:"http://arc.arts.ualberta.ca", is_approved: true, creators_name: "Omar Rodriguez-Arenas", creators_url: "http://omarrodriguez.org", creators_email: "orodrigu@ualberta.ca", image_url: "images/tools/seed/e.png", last_updated:"2015-02-10", description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer venenatis nulla non arcu varius, a placerat dolor dignissim. Integer ac ullamcorper ligula, ac porta arcu. Vestibulum vestibulum dolor id arcu blandit vehicula. Nullam condimentum velit id bibendum luctus. Donec eu eros vestibulum, sodales elit at, tincidunt urna. Donec mollis aliquet massa ac ultrices. Duis molestie lorem ac leo cursus, et bibendum leo venenatis. Ut ornare risus ac tellus accumsan interdum eget non mi. Nunc cursus bibendum ex, sed consequat mi. In vestibulum fringilla ipsum in euismod. Quisque quam erat, sodales vitae porttitor quis, vehicula facilisis sem. Phasellus ut odio nisl. Aenean gravida quis urna ut laoreet.");


Tag.create(id:1, value:"Tag 1");
Tag.create(id:2, value:"Tag 2");
Tag.create(id:3, value:"Tag 3");
Tag.create(id:4, value:"Tag 4");
Tag.create(id:5, value:"Tag 5");

ToolTag.create(user_id: 2, tool_id: 1, tag_id: 1);
ToolTag.create(user_id: 2, tool_id: 1, tag_id: 2);
ToolTag.create(user_id: 2, tool_id: 2, tag_id: 1);
ToolTag.create(user_id: 2, tool_id: 3, tag_id: 4);
ToolTag.create(user_id: 2, tool_id: 4, tag_id: 5);

ToolAttribute.create(tool_id: 1, attribute_type_id: 5, value: 21);
ToolAttribute.create(tool_id: 2, attribute_type_id: 5, value: 25);
ToolAttribute.create(tool_id: 2, attribute_type_id: 5, value: 23);
ToolAttribute.create(tool_id: 2, attribute_type_id: 5, value: 22);
ToolAttribute.create(tool_id: 2, attribute_type_id: 5, value: 25);
