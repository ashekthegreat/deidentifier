var express = require('express');
var app = express();
var path = require('path');
var csv = require("fast-csv");
var fs = require("fs");
var _ = require("underscore");
var faker = require('faker');

app.use(express.static('assets'));
app.use(express.static('app'));

app.use("/assets", express.static(__dirname + '/assets'));
app.use("/app", express.static(__dirname + '/app'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// viewed at http://localhost:3001
app.get('/get-headers', function(req, res) {
    var response = [];
    var fileStream = fs.createReadStream(path.join(__dirname + '/data/data.csv'), 'utf8');
    var csvStream = csv({headers: false});
    fileStream.pipe(csvStream);

    var onData = function(data){
        response = data;
        csvStream.emit('donereading');
    };
    csvStream.on('data', onData);

    csvStream
        .on("end", function(){
            csvStream.emit('donereading');
        })
        .on('donereading', function(){
            fileStream.close();
            csvStream.removeListener('data', onData);
            res.json( response );
        });
});

app.get('/transform', function(req, res) {
    // clear previously created pairs
    var generatedPairs = [];
    var count = 0;

    csv
        .fromPath(path.join(__dirname + '/data/data.csv'), {headers: true})
        .transform(function(obj){
            count++;
            return formatData(obj, generatedPairs, count);
        })
        .on("end", function(){
            console.log(count);
            res.json( [count] );
        })
        .pipe(csv.createWriteStream({headers: true}))
        .pipe(fs.createWriteStream(path.join(__dirname + '/data/out.csv'), {encoding: "utf8"}));


});

var definition = {
    hicn: "HICN_MBI",
    firstName: "PATFIRSTNAME",
    lastName: "PATLASTNAME",
    gender: "PATGENDER",
    address: "PATADDRESS1",
    zip: "PATZIPCODE",
    dob: "PATBIRTHDATE"
};

var firstName = {
    "both": ["Aubrey", "Blaine", "Blair", "Casey", "Dakota", "Eden", "Kaden", "Kendall", "Quincy", "Sloane", "Taylor", "Xerxes"],
    "female": ["Abigail", "Abra", "Adara", "Adele", "Adena", "Adria", "Adrienne", "Aiko", "Aileen", "Aimee", "Ainsley", "Alana", "Alea", "Alexa", "Alexandra", "Alexis", "Alfreda", "Alice", "Alika", "Aline", "Alisa", "Allegra", "Alma", "Althea", "Alyssa", "Amanda", "Amaya", "Amber", "Amela", "Amelia", "Amena", "Amethyst", "Amity", "Amy", "Anastasia", "Angela", "Angelica", "Anika", "Anjolie", "Ann", "Anne", "Aphrodite", "April", "Aretha", "Ariana", "Ariel", "Ashely", "Aspen", "Astra", "Athena", "Audra", "Audrey", "Aurelia", "Aurora", "Autumn", "Ava", "Avye", "Ayanna", "Azalia", "Barbara", "Basia", "Beatrice", "Bell", "Belle", "Bertha", "Bethany", "Beverly", "Bianca", "Blossom", "Blythe", "Bo", "Breanna", "Bree", "Brenda", "Brenna", "Brianna", "Briar", "Brielle", "Britanney", "Britanni", "Brittany", "Brooke", "Bryar", "Brynn", "Brynne", "Buffy", "Cailin", "Calista", "Callie", "Cally", "Cameran", "Cameron", "Camilla", "Camille", "Candace", "Candice", "Cara", "Carissa", "Carla", "Carly", "Carol", "Carolyn", "Caryn", "Cassady", "Cassandra", "Cassidy", "Catherine", "Cathleen", "Cecilia", "Celeste", "Chanda", "Chantale", "Charde", "Charissa", "Charity", "Charlotte", "Chastity", "Chava", "Chelsea", "Cherokee", "Cheryl", "Cheyenne", "Chiquita", "Chloe", "Christen", "Christine", "Ciara", "Claire", "Clare", "Claudia", "Clementine", "Cleo", "Clio", "Colette", "Colleen", "Constance", "Cora", "Courtney", "Cynthia", "Dacey", "Dahlia", "Dai", "Dana", "Danielle", "Daphne", "Dara", "Daria", "Darrel", "Darryl", "Daryl", "Dawn", "Deanna", "Deborah", "Debra", "Deirdre", "Delilah", "Demetria", "Denise", "Desirae", "Desiree", "Destiny", "Diana", "Dominique", "Donna", "Dora", "Doris", "Dorothy", "Ebony", "Echo", "Elaine", "Eleanor", "Eliana", "Elizabeth", "Ella", "Emerald", "Emi", "Emily", "Emma", "Erica", "Erin", "Eugenia", "Evangeline", "Eve", "Evelyn", "Faith", "Fallon", "Farrah", "Fatima", "Fay", "Felicia", "Fiona", "Flavia", "Fleur", "Florence", "Frances", "Francesca", "Fredericka", "Freya", "Gail", "Galena", "Gay", "Gemma", "Genevieve", "Georgia", "Geraldine", "Germaine", "Germane", "Gillian", "Ginger", "Gisela", "Giselle", "Glenna", "Gloria", "Grace", "Gretchen", "Guinevere", "Gwendolyn", "Hadassah", "Hadley", "Halee", "Haley", "Halla", "Hanae", "Hanna", "Hannah", "Harriet", "Haviva", "Hayfa", "Hayley", "Heather", "Hedda", "Hedwig", "Hedy", "Heidi", "Helen", "Hermione", "Hilary", "Hilda", "Hillary", "Hiroko", "Hollee", "Holly", "Hope", "Hyacinth", "Idola", "Idona", "Ifeoma", "Ignacia", "Ila", "Iliana", "Illana", "Illiana", "Ima", "Imani", "Imelda", "Imogene", "Ina", "India", "Indigo", "Indira", "Inez", "Inga", "Ingrid", "Iola", "Iona", "Irene", "Iris", "Irma", "Isabella", "Isabelle", "Isadora", "Ivana", "Ivory", "Ivy", "Jada", "Jade", "Jaden", "Jael", "Jaime", "Jamalia", "Jana", "Jane", "Janna", "Jaquelyn", "Jasmine", "Jayme", "Jeanette", "Jemima", "Jena", "Jenette", "Jenna", "Jennifer", "Jescie", "Jessamine", "Jessica", "Jillian", "Joan", "Jocelyn", "Joelle", "Jolene", "Jolie", "Jordan", "Jorden", "Josephine", "Joy", "Judith", "Julie", "Juliet", "Justina", "Justine", "Kai", "Kaitlin", "Kalia", "Kameko", "Karen", "Karina", "Karleigh", "Karly", "Karyn", "Katell", "Katelyn", "Kathleen", "Kay", "Kaye", "Keelie", "Keely", "Keiko", "Kellie", "Kelly", "Kelsey", "Kelsie", "Kerry", "Kessie", "Kevyn", "Kiara", "Kiayada", "Kim", "Kimberley", "Kimberly", "Kiona", "Kirby", "Kirestin", "Kirsten", "Kitra", "Kristen", "Kyla", "Kylan", "Kylee", "Kylie", "Kylynn", "Kyra", "Lacey", "Lacota", "Lacy", "Lael", "Lana", "Lani", "Lara", "Lareina", "Larissa", "Latifah", "Laura", "Laurel", "Lavinia", "Leah", "Leandra", "Lee", "Leigh", "Leila", "Leilani", "Lenore", "Lesley", "Leslie", "Libby", "Liberty", "Lila", "Lilah", "Lillian", "Lillith", "Linda", "Lisandra", "Lois", "Lucy", "Lunea", "Lydia", "Lynn", "Lysandra", "MacKensie", "MacKenzie", "Macey", "Macy", "Madaline", "Madeline", "Madeson", "Madison", "Madonna", "Maggie", "Maggy", "Maia", "Maile", "Maisie", "Maite", "Mallory", "Mara", "Marah", "Marcia", "Margaret", "Mari", "Mariam", "Mariko", "Maris", "Marny", "Martena", "Martha", "Martina", "Mary", "Maryam", "Maxine", "May", "Maya", "McKenzie", "Mechelle", "Medge", "Megan", "Meghan", "Melanie", "Melinda", "Melissa", "Melodie", "Melyssa", "Mercedes", "Meredith", "Mia", "Michelle", "Mikayla", "Minerva", "Mira", "Miranda", "Miriam", "Moana", "Mollie", "Molly", "Mona", "Montana", "Morgan", "Myra", "Nadine", "Naida", "Naomi", "Natalie", "Nayda", "Nell", "Nelle", "Nerea", "Nevada", "Neve", "Nichole", "Nicole", "Nina", "Nita", "Noel", "Noelani", "Noelle", "Nola", "Nomlanga", "Nora", "Nyssa", "Ocean", "Octavia", "Odessa", "Odette", "Olga", "Olivia", "Olympia", "Oprah", "Ora", "Ori", "Orla", "Orli", "Paloma", "Pamela", "Pandora", "Pascale", "Patience", "Patricia", "Paula", "Pearl", "Penelope", "Petra", "Phoebe", "Phyllis", "Piper", "Portia", "Priscilla", "Quail", "Quemby", "Quin", "Quinn", "Quintessa", "Quon", "Quyn", "Quynn", "Rachel", "Rae", "Rama", "Ramona", "Rana", "Raven", "Raya", "Reagan", "Rebecca", "Rebekah", "Regan", "Regina", "Remedios", "Renee", "Rhea", "Rhiannon", "Rhoda", "Rhona", "Rhonda", "Ria", "Riley", "Rina", "Rinah", "Risa", "Roanna", "Roary", "Robin", "Rosalyn", "Rose", "Rowan", "Ruby", "Ruth", "Rylee", "Sacha", "Sade", "Sage", "Samantha", "Sandra", "Sara", "Sarah", "Sasha", "Savannah", "Scarlet", "Scarlett", "Selma", "September", "Serena", "Serina", "Shaeleigh", "Shafira", "Shaine", "Shana", "Shannon", "Sharon", "Shay", "Shea", "Sheila", "Shelby", "Shelley", "Shellie", "Shelly", "Shoshana", "Sierra", "Signe", "Sigourney", "Simone", "Skyler", "Sonia", "Sonya", "Sophia", "Sopoline", "Stacey", "Stacy", "Stella", "Stephanie", "Suki", "Summer", "Susan", "Sybil", "Sybill", "Sydnee", "Sydney", "Sylvia", "TaShya", "Tallulah", "Tamara", "Tamekah", "Tana", "Tanisha", "Tanya", "Tara", "Tasha", "Tashya", "Tatiana", "Tatum", "Tatyana", "Teagan", "Teegan", "Ulla", "Uma", "Unity", "Urielle", "Ursa", "Ursula", "Uta", "Vanna", "Veda", "Velma", "Venus", "Vera", "Veronica", "Victoria", "Vielka", "Violet", "Virginia", "Vivian", "Vivien", "Wanda", "Wendy", "Whilemina", "Whitney", "Whoopi", "Willa", "Willow", "Wilma", "Winifred", "Winter", "Wynne", "Wynter", "Wyoming", "Xandra", "Xantha", "Xaviera", "Xena", "Xyla", "Yael", "Yen", "Yeo", "Yetta", "Yoko", "Yolanda", "Yoshi", "Yuri", "Yvette", "Yvonne", "Zelda", "Zelenia", "Zena", "Zenaida", "Zenia", "Zephr", "Zia", "Zoe", "Zorita", "Jacqueline"],
    "male": ["Aaron", "Abbot", "Abdul", "Abel", "Abraham", "Acton", "Adam", "Addison", "Adrian", "Ahmed", "Aidan", "Akeem", "Aladdin", "Alan", "Alden", "Alec", "Alexander", "Alfonso", "Ali", "Allen", "Allistair", "Alvin", "Amal", "Amery", "Amir", "Amos", "Andrew", "Anthony", "Aquila", "Arden", "Aristotle", "Armand", "Armando", "Arsenio", "Arthur", "Asher", "Ashton", "August", "Austin", "Avram", "Axel", "Baker", "Barclay", "Barrett", "Barry", "Basil", "Baxter", "Beau", "Beck", "Benedict", "Benjamin", "Berk", "Bernard", "Bert", "Bevis", "Blake", "Blaze", "Boris", "Bradley", "Brady", "Branden", "Brandon", "Brendan", "Brenden", "Brennan", "Brent", "Brett", "Brian", "Brock", "Brody", "Bruce", "Bruno", "Buckminster", "Burke", "Burton", "Byron", "Cade", "Cadman", "Caesar", "Cain", "Cairo", "Caldwell", "Caleb", "Callum", "Calvin", "Camden", "Cameron", "Carl", "Carlos", "Carson", "Carter", "Castor", "Cedric", "Chadwick", "Chaim", "Chancellor", "Chandler", "Chaney", "Channing", "Charles", "Chase", "Chester", "Christian", "Christopher", "Ciaran", "Clark", "Clarke", "Clayton", "Clinton", "Coby", "Cody", "Colby", "Cole", "Colin", "Colorado", "Colt", "Colton", "Conan", "Connor", "Cooper", "Craig", "Cruz", "Cullen", "Curran", "Cyrus", "Dale", "Dalton", "Damian", "Damon", "Dane", "Daniel", "Dante", "Daquan", "Darius", "David", "Davis", "Deacon", "Dean", "Declan", "Demetrius", "Dennis", "Denton", "Derek", "Devin", "Dexter", "Dieter", "Dillon", "Dolan", "Dominic", "Donovan", "Dorian", "Drake", "Drew", "Driscoll", "Duncan", "Dustin", "Dylan", "Eagan", "Eaton", "Edan", "Edward", "Elijah", "Elliott", "Elmo", "Elton", "Elvis", "Emerson", "Emery", "Emmanuel", "Erasmus", "Eric", "Erich", "Ethan", "Evan", "Ezekiel", "Ezra", "Felix", "Ferdinand", "Ferris", "Finn", "Fitzgerald", "Fletcher", "Flynn", "Forrest", "Francis", "Fritz", "Fuller", "Fulton", "Gabriel", "Gage", "Galvin", "Gannon", "Gareth", "Garrett", "Garrison", "Garth", "Gary", "Gavin", "Geoffrey", "George", "Giacomo", "Gil", "Grady", "Graham", "Graiden", "Grant", "Gray", "Gregory", "Griffin", "Griffith", "Guy", "Hakeem", "Hall", "Hamilton", "Hamish", "Hammett", "Harding", "Harlan", "Harper", "Harrison", "Hasad", "Hashim", "Hayden", "Hayes", "Hector", "Hedley", "Henry", "Herman", "Herrod", "Hilel", "Hiram", "Holmes", "Honorato", "Hop", "Howard", "Hoyt", "Hu", "Hunter", "Hyatt", "Ian", "Ignatius", "Igor", "Ira", "Isaac", "Isaiah", "Ishmael", "Ivan", "Ivor", "Jack", "Jackson", "Jacob", "Jakeem", "Jamal", "James", "Jameson", "Jared", "Jarrod", "Jason", "Jasper", "Jelani", "Jeremy", "Jermaine", "Jerome", "Jerry", "Jesse", "Jin", "Joel", "John", "Jonah", "Jonas", "Jordan", "Joseph", "Joshua", "Josiah", "Judah", "Julian", "Justin", "Kadeem", "Kamal", "Kane", "Kareem", "Kaseem", "Kasimir", "Kasper", "Kato", "Keane", "Keaton", "Keefe", "Keegan", "Keith", "Kelly", "Kennan", "Kennedy", "Kenneth", "Kenyon", "Kermit", "Kevin", "Kibo", "Kieran", "Kirk", "Knox", "Kuame", "Kyle", "Laith", "Lamar", "Lance", "Lane", "Lars", "Lawrence", "Lee", "Len", "Leo", "Leonard", "Leroy", "Lester", "Lev", "Levi", "Lewis", "Linus", "Lionel", "Logan", "Louis", "Lucas", "Lucian", "Lucius", "Luke", "Lyle", "Macaulay", "Macon", "Magee", "Malachi", "Malcolm", "Malik", "Mannix", "Mark", "Marsden", "Marshall", "Martin", "Marvin", "Mason", "Matthew", "Maxwell", "Melvin", "Merrill", "Merritt", "Micah", "Michael", "Mohammad", "Moses", "Mufutau", "Murphy", "Myles", "Nash", "Nasim", "Nathan", "Nathaniel", "Nehru", "Neil", "Nero", "Neville", "Nicholas", "Nigel", "Nissim", "Noah", "Noble", "Nolan", "Norman", "Octavius", "Odysseus", "Oleg", "Oliver", "Omar", "Oren", "Orlando", "Orson", "Oscar", "Otto", "Owen", "Paki", "Palmer", "Patrick", "Paul", "Perry", "Peter", "Phelan", "Philip", "Phillip", "Plato", "Porter", "Prescott", "Preston", "Price", "Quamar", "Quentin", "Quinlan", "Quinn", "Rafael", "Rahim", "Raja", "Rajah", "Ralph", "Randall", "Raphael", "Rashad", "Ray", "Raymond", "Reece", "Reed", "Reese", "Reuben", "Richard", "Rigel", "Robert", "Rogan", "Ronan", "Rooney", "Ross", "Roth", "Rudyard", "Russell", "Ryan", "Ryder", "Salvador", "Samson", "Samuel", "Sawyer", "Scott", "Sean", "Sebastian", "Seth", "Shad", "Silas", "Simon", "Slade", "Solomon", "Steel", "Stephen", "Steven", "Stewart", "Stone", "Stuart", "Sylvester", "Tad", "Talon", "Tanek", "Tanner", "Tarik", "Tate", "Thaddeus", "Thane", "Theodore", "Thomas", "Thor", "Tiger", "Timon", "Timothy", "Tobias", "Todd", "Travis", "Trevor", "Troy", "Tucker", "Tyler", "Tyrone", "Ulric", "Ulysses", "Upton", "Uriah", "Uriel", "Valentine", "Vance", "Vaughan", "Vernon", "Victor", "Vincent", "Vladimir", "Wade", "Walker", "Wallace", "Walter", "Wang", "Warren", "Wayne", "Wesley", "William", "Wing", "Wyatt", "Wylie", "Xander", "Xanthus", "Xavier", "Xenos", "Yardley", "Yasir", "Yoshio", "Yuli", "Zachary", "Zachery", "Zahir", "Zane", "Zeph", "Zephania", "Zeus"]
}

var lastName = ["Abbott", "Acevedo", "Acosta", "Adams", "Adkins", "Aguilar", "Aguirre", "Albert", "Alexander", "Alford", "Allen", "Allison", "Alston", "Alvarado", "Alvarez", "Anderson", "Andrews", "Anthony", "Armstrong", "Arnold", "Ashley", "Atkins", "Atkinson", "Austin", "Avery", "Avila", "Ayala", "Ayers", "Bailey", "Baird", "Baker", "Baldwin", "Ball", "Ballard", "Banks", "Barber", "Barker", "Barlow", "Barnes", "Barnett", "Barr", "Barrera", "Barrett", "Barron", "Barry", "Bartlett", "Barton", "Bass", "Bates", "Battle", "Bauer", "Baxter", "Beach", "Bean", "Beard", "Beasley", "Beck", "Becker", "Bell", "Bender", "Benjamin", "Bennett", "Benson", "Bentley", "Benton", "Berg", "Berger", "Bernard", "Berry", "Best", "Bird", "Bishop", "Black", "Blackburn", "Blackwell", "Blair", "Blake", "Blanchard", "Blankenship", "Blevins", "Bolton", "Bond", "Bonner", "Booker", "Boone", "Booth", "Bowen", "Bowers", "Bowman", "Boyd", "Boyer", "Boyle", "Bradford"];

var zip5 = ['63441', '63442', '63443', '63445', '63446'];
var zip4 = ['7123', '8823', '0172', '3284', '1165'];
var dobYear = _.range(1930, 1960);
var dobMonth = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var dobDay = _.range(10, 29);


function getReplacePair(row, generatedPairs, count){
    // check if such a pair already exists. if yes, return that
    var produced = _.find(generatedPairs, function(pair){
        return pair.id == row[definition.hicn];
    });

    if(!produced){
        // its a new pair. lets create one and push
        produced = {
            id: row[definition.hicn]
        };
        produced[definition.hicn] = ("9999999" + count + "99").slice(-9) + "Q";
        produced[definition.lastName] = _.sample(lastName);
        produced[definition.firstName] = (row[definition.gender] == "F" ? _.sample(firstName.female) : _.sample(firstName.male));
        produced[definition.zip] = ("" + _.sample(zip5) + _.sample(zip4));
        produced[definition.dob] = ("" + _.sample(dobYear) + _.sample(dobMonth) + _.sample(dobDay));
        produced[definition.address] = faker.address.streetAddress();

        generatedPairs.push(produced);
    }
    var cloned = {};
    _.extend(cloned, produced);
    if(cloned.id){
        delete cloned.id;
    }
    return cloned;
}

function formatData(row, generatedPairs, count){
    var replacePair = getReplacePair(row, generatedPairs, count);
    console.log(replacePair);
    _.extend(row, replacePair);
    return row;
}

app.listen(3003);