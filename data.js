const CLASS_LABELS = {
  first: "First-Class",
  second: "Second-Class",
  associated: "Associated Relic",
  collection: "Collection Record",
  unspecified: "Class Not Specified",
};

const ACCESS_LABELS = {
  permanent_display: "Permanent display",
  temporary_exposition: "Temporary exposition",
  altar_repository: "Altar repository",
  not_specified: "Access not specified",
  published_shrine_access: "Published shrine access",
};

const SOURCE_TYPE_LABELS = {
  official_shrine_list: "Official shrine list",
  apostolate_custody_list: "Apostolate custody list",
  official_diocesan_pdf: "Official diocesan PDF",
  official_event_pdf: "Official event PDF",
  curated_editorial_record: "Curated editorial record",
};

const IMAGES = {
  hero:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/1280px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
  vatican:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/1280px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
  santiago:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Santiago_cathedral_2021.jpg/960px-Santiago_cathedral_2021.jpg",
  paris:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Notre-Dame_de_Paris%2C_4_October_2017.jpg/1280px-Notre-Dame_de_Paris%2C_4_October_2017.jpg",
  seville:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Sevilla_Cathedral_-_Southeast.jpg/1280px-Sevilla_Cathedral_-_Southeast.jpg",
  cologne:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/K%C3%B6lner_Dom_-_Westfassade_2022_ohne_Ger%C3%BCst-0968_b.jpg/960px-K%C3%B6lner_Dom_-_Westfassade_2022_ohne_Ger%C3%BCst-0968_b.jpg",
  goa:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/1280px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg",
  krakow:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Church_of_Divine_Mercy%2C_3_Siostry_Faustyny_street%2C_%C5%81agiewniki%2C_Krak%C3%B3w_Poland.jpg/1280px-Church_of_Divine_Mercy%2C_3_Siostry_Faustyny_street%2C_%C5%81agiewniki%2C_Krak%C3%B3w_Poland.jpg",
  chennai:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Santhome_Basilica.jpg/1280px-Santhome_Basilica.jpg",
  padrePio:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Chiesa_San_Pio_da_Pietrelcina.JPG/1280px-Chiesa_San_Pio_da_Pietrelcina.JPG",
  assisi:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Assisi_San_Francesco_BW_2.JPG/1280px-Assisi_San_Francesco_BW_2.JPG",
  padua:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Veneto_Padova1_tango7174.jpg/1280px-Veneto_Padova1_tango7174.jpg",
};

function normalizeCountry(country) {
  if (!country) {
    return "Unspecified";
  }
  if (country === "USA") {
    return "United States";
  }
  return country;
}

function deriveInstitutionType(name) {
  const lower = (name || "").toLowerCase();

  if (lower.includes("cathedral")) {
    return "Cathedral";
  }
  if (lower.includes("basilica")) {
    return "Basilica";
  }
  if (lower.includes("oratory")) {
    return "Oratory";
  }
  if (lower.includes("abbey")) {
    return "Abbey";
  }
  if (lower.includes("monastery")) {
    return "Monastery";
  }
  if (lower.includes("convent")) {
    return "Convent";
  }
  if (lower.includes("sanctuary")) {
    return "Sanctuary";
  }
  if (lower.includes("shrine")) {
    return "Shrine";
  }
  if (lower.includes("museum")) {
    return "Museum";
  }
  if (lower.includes("chapel")) {
    return "Chapel";
  }
  if (lower.includes("mission")) {
    return "Mission";
  }
  if (lower.includes("custody list")) {
    return "Custody List";
  }
  if (lower.includes("church")) {
    return "Church";
  }
  return "Institution";
}

function buildRelicName(relic, saint) {
  const saintName = saint || "Unspecified saint";
  const relicName = relic || "Relic";

  if (relicName === "Unspecified relic") {
    return `Relic of ${saintName}`;
  }

  if (relicName.toLowerCase().includes(saintName.toLowerCase())) {
    return relicName;
  }

  return `${relicName} of ${saintName}`;
}

function accessSentence(accessType) {
  if (accessType === "permanent_display") {
    return "The source describes this record as part of a permanent display. Check the institution's hours before visiting.";
  }
  if (accessType === "temporary_exposition") {
    return "The source describes this record as part of a temporary exposition. Confirm that the exposition is still active before visiting.";
  }
  if (accessType === "altar_repository") {
    return "The source places this record in an altar repository. Access can depend on church opening and liturgical schedules.";
  }
  if (accessType === "published_shrine_access") {
    return "The host institution publishes ordinary access to this shrine or reliquary setting. Check current local hours before visiting.";
  }
  return "The source confirms custody or listing, but does not specify standard public viewing conditions. Contact the institution before visiting.";
}

function record(entry) {
  return {
    accessType: "published_shrine_access",
    accessLabel: ACCESS_LABELS.published_shrine_access,
    sourceType: "curated_editorial_record",
    sourceTypeLabel: SOURCE_TYPE_LABELS.curated_editorial_record,
    collectionMode: "editorial_record",
    classLabel: CLASS_LABELS[entry.classType],
    institutionType: "Shrine",
    notes: "",
    ...entry,
    classLabel: CLASS_LABELS[entry.classType],
    accessType: entry.accessType || "published_shrine_access",
    accessLabel: ACCESS_LABELS[entry.accessType || "published_shrine_access"],
    sourceType: entry.sourceType || "curated_editorial_record",
    sourceTypeLabel: SOURCE_TYPE_LABELS[entry.sourceType || "curated_editorial_record"],
  };
}

const curatedRelics = [
  record({
    id: "st-peter-tomb",
    relicName: "Tomb of Saint Peter",
    saintOrEvent: "Saint Peter",
    classType: "first",
    city: "Vatican City",
    country: "Vatican City",
    shrine: "St. Peter's Basilica",
    institutionType: "Basilica",
    summary: "The traditional burial site of Saint Peter lies beneath the papal altar.",
    whereLocated: "In the confessio below the high altar of St. Peter's Basilica, above the Vatican necropolis.",
    howToSee: "Enter the basilica and approach the confessio. The deeper necropolis area requires a separate Scavi reservation.",
    expositionInfo: "The confessio is visible year-round. The excavations below are seen only on reserved guided visits.",
    sourceLabel: "St. Peter's Basilica",
    sourceUrl: "https://www.basilicasanpietro.va/",
  }),
  record({
    id: "st-paul-tomb",
    relicName: "Tomb of Saint Paul",
    saintOrEvent: "Saint Paul",
    classType: "first",
    city: "Rome",
    country: "Italy",
    shrine: "Basilica of St. Paul Outside the Walls",
    institutionType: "Basilica",
    summary: "The shrine under the high altar marks the traditional burial place of Saint Paul.",
    whereLocated: "In the confessio beneath the high altar of the basilica.",
    howToSee: "Visible from within the basilica during ordinary visiting hours.",
    expositionInfo: "Normally visible in place. Access patterns follow basilica liturgical schedules.",
    sourceLabel: "Basilica of St. Paul Outside the Walls",
    sourceUrl: "https://www.basilicasanpaolo.org/en/",
  }),
  record({
    id: "chains-of-peter",
    relicName: "Chains of Saint Peter",
    saintOrEvent: "Saint Peter",
    classType: "second",
    city: "Rome",
    country: "Italy",
    shrine: "San Pietro in Vincoli",
    institutionType: "Church",
    summary: "The church preserves chains traditionally linked to Saint Peter's imprisonment.",
    whereLocated: "In a reliquary at San Pietro in Vincoli in Rome.",
    howToSee: "Visible inside the church during its normal opening hours.",
    expositionInfo: "Usually kept in place for ongoing veneration.",
    sourceLabel: "San Pietro in Vincoli",
    sourceUrl: "https://en.wikipedia.org/wiki/San_Pietro_in_Vincoli",
  }),
  record({
    id: "francis-tomb",
    relicName: "Tomb of Saint Francis",
    saintOrEvent: "Saint Francis of Assisi",
    classType: "first",
    city: "Assisi",
    country: "Italy",
    shrine: "Basilica of Saint Francis",
    institutionType: "Basilica",
    summary: "The lower basilica descends to the burial place of Saint Francis.",
    whereLocated: "In the crypt beneath the lower basilica in Assisi.",
    howToSee: "Accessible on the standard pilgrimage path through the lower church.",
    expositionInfo: "The tomb is generally visible year-round during shrine opening hours.",
    sourceLabel: "Basilica of Saint Francis",
    sourceUrl: "https://www.sanfrancescoassisi.org/html/eng/index.php",
  }),
  record({
    id: "anthony-padua",
    relicName: "Relics of Saint Anthony of Padua",
    saintOrEvent: "Saint Anthony of Padua",
    classType: "first",
    city: "Padua",
    country: "Italy",
    shrine: "Pontifical Basilica of Saint Anthony of Padua",
    institutionType: "Basilica",
    summary: "Padua preserves the principal shrine of Saint Anthony, including the saint's tomb and the basilica's relic chapel.",
    whereLocated: "Within the basilica complex in Padua, especially around the saint's tomb and the Chapel of the Relics.",
    howToSee: "Accessible on the basilica visit route during published pilgrimage and visiting hours.",
    expositionInfo: "The shrine remains a permanent devotional focus. Individual reliquaries and chapel access follow basilica schedules.",
    sourceLabel: "Basilica of Saint Anthony",
    sourceUrl: "https://www.basilicasantantonio.va/en/",
  }),
  record({
    id: "crown-of-thorns",
    relicName: "Crown of Thorns",
    saintOrEvent: "Passion of Christ",
    classType: "associated",
    city: "Paris",
    country: "France",
    shrine: "Notre-Dame de Paris",
    institutionType: "Cathedral",
    summary: "Notre-Dame now again centers public devotion to the Crown of Thorns.",
    whereLocated: "In the reliquary shrine of the axial chapel at Notre-Dame de Paris.",
    howToSee: "Notre-Dame publishes regular Friday and first-Friday veneration times, plus special observances such as Good Friday.",
    expositionInfo: "Treasury and veneration schedules change seasonally. Confirm the cathedral's current calendar before visiting.",
    sourceLabel: "Notre-Dame de Paris",
    sourceUrl: "https://www.notredamedeparis.fr/en/pray/services-masses/veneration-crown-thorns/",
  }),
  record({
    id: "catherine-laboure-paris",
    relicName: "Body of Saint Catherine Laboure",
    saintOrEvent: "Saint Catherine Laboure",
    classType: "first",
    city: "Paris",
    country: "France",
    shrine: "Chapel of Our Lady of the Miraculous Medal",
    institutionType: "Chapel",
    summary: "Rue du Bac preserves the incorrupt body of Saint Catherine Laboure.",
    whereLocated: "In a glass shrine in the chapel at Rue du Bac.",
    howToSee: "Accessible during the chapel's published opening hours.",
    expositionInfo: "Normally visible in place and tied to the chapel's daily devotional schedule.",
    sourceLabel: "Miraculous Medal Chapel",
    sourceUrl: "https://en.wikipedia.org/wiki/Chapel_of_Our_Lady_of_the_Miraculous_Medal",
  }),
  record({
    id: "ferdinand-seville",
    relicName: "Body of Saint Ferdinand III",
    saintOrEvent: "Saint Ferdinand III",
    classType: "first",
    city: "Seville",
    country: "Spain",
    shrine: "Seville Cathedral",
    institutionType: "Cathedral",
    summary: "Saint Ferdinand III rests in the Royal Chapel of Seville Cathedral.",
    whereLocated: "In the silver urn of the Royal Chapel at Seville Cathedral.",
    howToSee: "See the shrine by entering the cathedral and Royal Chapel during visiting or liturgical access hours.",
    expositionInfo: "The cathedral chapter announces specific public openings of the urn, especially around the feast of Saint Ferdinand.",
    sourceLabel: "Seville Cathedral",
    sourceUrl: "https://www.catedraldesevilla.es/en/the-cathedral/building/renaissance-additions-royal-chapel-chapter-house-and-main-sacristy/",
  }),
  record({
    id: "leander-seville",
    relicName: "Relics of Saint Leander",
    saintOrEvent: "Saint Leander of Seville",
    classType: "first",
    city: "Seville",
    country: "Spain",
    shrine: "Seville Cathedral",
    institutionType: "Cathedral",
    summary: "Seville Cathedral also preserves relics of Saint Leander.",
    whereLocated: "In the cathedral chapel dedicated to Saint Leander.",
    howToSee: "Enter the cathedral and visit the chapel of San Leandro.",
    expositionInfo: "The cathedral indicates that the relics are displayed on Saint Leander's feast, 13 November.",
    sourceLabel: "Seville Cathedral feast notice",
    sourceUrl: "https://www.catedraldesevilla.es/en/today-we-celebrate-the-feast-of-saint-leander/",
  }),
  record({
    id: "three-kings-cologne",
    relicName: "Shrine of the Three Kings",
    saintOrEvent: "Magi tradition",
    classType: "first",
    city: "Cologne",
    country: "Germany",
    shrine: "Cologne Cathedral",
    institutionType: "Cathedral",
    summary: "Cologne Cathedral preserves one of Europe's most famous reliquaries, linked with the Magi.",
    whereLocated: "In the choir area of Cologne Cathedral.",
    howToSee: "Visible during cathedral opening hours.",
    expositionInfo: "The shrine is normally visible in place year-round.",
    sourceLabel: "Cologne Cathedral",
    sourceUrl: "https://www.koelner-dom.de/en",
  }),
  record({
    id: "shroud-of-turin",
    relicName: "Shroud of Turin",
    saintOrEvent: "Passion of Christ",
    classType: "associated",
    city: "Turin",
    country: "Italy",
    shrine: "Cathedral of Saint John the Baptist",
    institutionType: "Cathedral",
    summary: "The Shroud is preserved in Turin Cathedral in a controlled conservation case.",
    whereLocated: "In Turin Cathedral, in the last chapel of the left aisle under the Royal Tribune.",
    howToSee: "Pilgrims may visit the chapel and pray before the chapel window during cathedral opening hours; the cloth itself is not ordinarily visible.",
    expositionInfo: "Public ostensions are occasional and separately announced by the official Shroud site.",
    sourceLabel: "Santa Sindone",
    sourceUrl: "https://sindone.org/en/home-english/",
  }),
  record({
    id: "james-compostela",
    relicName: "Relics of Saint James",
    saintOrEvent: "Saint James the Greater",
    classType: "first",
    city: "Santiago de Compostela",
    country: "Spain",
    shrine: "Cathedral of Santiago de Compostela",
    institutionType: "Cathedral",
    summary: "The relic shrine of Saint James is the heart of Santiago de Compostela.",
    whereLocated: "Beneath the main altar in the cathedral shrine complex.",
    howToSee: "Accessible through the cathedral; pilgrims often visit the crypt directly after entering.",
    expositionInfo: "The shrine is a permanent devotional focus. Cathedral ceremonies and Holy Years affect crowd levels.",
    sourceLabel: "Cathedral of Santiago de Compostela",
    sourceUrl: "https://catedraldesantiago.es/en/",
  }),
  record({
    id: "holy-chalice-valencia",
    relicName: "Holy Chalice",
    saintOrEvent: "Last Supper tradition",
    classType: "associated",
    city: "Valencia",
    country: "Spain",
    shrine: "Valencia Cathedral",
    institutionType: "Cathedral",
    summary: "Valencia Cathedral houses the chalice traditionally venerated as the cup of the Last Supper.",
    whereLocated: "In the Holy Chalice Chapel of Valencia Cathedral.",
    howToSee: "Accessible through the cathedral visit route.",
    expositionInfo: "Normally visible in the chapel; special liturgical observances add emphasis.",
    sourceLabel: "Valencia Cathedral",
    sourceUrl: "https://www.catedraldevalencia.es/en/holy-chalice/",
  }),
  record({
    id: "faustina-krakow",
    relicName: "Relics of Saint Faustina",
    saintOrEvent: "Saint Faustina Kowalska",
    classType: "first",
    city: "Krakow",
    country: "Poland",
    shrine: "Divine Mercy Sanctuary",
    institutionType: "Sanctuary",
    summary: "Krakow's Divine Mercy Sanctuary is the principal shrine of Saint Faustina.",
    whereLocated: "At Lagiewniki in Krakow.",
    howToSee: "Accessible during sanctuary opening hours.",
    expositionInfo: "Normally venerated in place, with especially heavy public devotion on Divine Mercy Sunday.",
    sourceLabel: "Divine Mercy Sanctuary",
    sourceUrl: "https://www.sanktuarium.faustyna.pl/en/",
  }),
  record({
    id: "john-paul-blood",
    relicName: "Blood Relic of Saint John Paul II",
    saintOrEvent: "Saint John Paul II",
    classType: "first",
    city: "Krakow",
    country: "Poland",
    shrine: "Sanctuary of Saint John Paul II",
    institutionType: "Sanctuary",
    summary: "Krakow also preserves a major blood relic of Saint John Paul II.",
    whereLocated: "At the Sanctuary of Saint John Paul II in Krakow.",
    howToSee: "Accessible during sanctuary hours.",
    expositionInfo: "Normally visible in its sanctuary setting.",
    sourceLabel: "Sanctuary of Saint John Paul II",
    sourceUrl: "https://www.sjanpawel2.pl/en/",
  }),
  record({
    id: "padre-pio-san-giovanni-rotondo",
    relicName: "Body of Saint Padre Pio",
    saintOrEvent: "Saint Pio of Pietrelcina",
    classType: "first",
    city: "San Giovanni Rotondo",
    country: "Italy",
    shrine: "Sanctuary of Saint Pio of Pietrelcina",
    institutionType: "Sanctuary",
    summary: "San Giovanni Rotondo preserves the body of Saint Padre Pio within one of the most visited modern saint sanctuaries in Europe.",
    whereLocated: "In the lower church of the Sanctuary of Saint Pio of Pietrelcina at San Giovanni Rotondo.",
    howToSee: "Pilgrims enter the sanctuary complex and descend to the veneration path during published opening hours.",
    expositionInfo: "The shrine is part of the ordinary sanctuary route, though access can tighten during major feast days and heavy pilgrim periods.",
    sourceLabel: "Sanctuary of Saint Pio of Pietrelcina",
    sourceUrl: "https://www.conventosantuariopadrepio.it/en/",
  }),
  record({
    id: "francis-xavier-goa",
    relicName: "Body of Saint Francis Xavier",
    saintOrEvent: "Saint Francis Xavier",
    classType: "first",
    city: "Goa",
    country: "India",
    shrine: "Basilica of Bom Jesus",
    institutionType: "Basilica",
    summary: "Goa preserves one of the Catholic world's most famous missionary relics.",
    whereLocated: "In a silver casket at the Basilica of Bom Jesus in Old Goa.",
    howToSee: "Accessible during basilica opening hours.",
    expositionInfo: "The body is usually visible in its casket. Large special expositions are occasional and announced separately.",
    sourceLabel: "Basilica of Bom Jesus",
    sourceUrl: "https://www.bomjesus.org/",
  }),
  record({
    id: "thomas-chennai",
    relicName: "Tomb of Saint Thomas the Apostle",
    saintOrEvent: "Saint Thomas the Apostle",
    classType: "first",
    city: "Chennai",
    country: "India",
    shrine: "San Thome Basilica",
    institutionType: "Basilica",
    summary: "San Thome Basilica is one of the principal global shrines of Saint Thomas the Apostle.",
    whereLocated: "In the crypt chapel of San Thome Basilica in Chennai.",
    howToSee: "Accessible during basilica and crypt opening hours.",
    expositionInfo: "Normally venerated in place.",
    sourceLabel: "San Thome Basilica",
    sourceUrl: "https://en.wikipedia.org/wiki/San_Thome_Church",
  }),
  record({
    id: "anthony-chapel-pittsburgh",
    relicName: "Saint Anthony Chapel Relic Collection",
    saintOrEvent: "Thousands of saints",
    classType: "collection",
    city: "Pittsburgh",
    country: "United States",
    shrine: "Saint Anthony Chapel",
    institutionType: "Chapel",
    summary: "Saint Anthony Chapel houses the largest publicly venerable relic collection outside the Vatican.",
    whereLocated: "At Saint Anthony Chapel, 1700 Harpster Street, Pittsburgh.",
    howToSee: "The chapel publishes visitation hours most days and separate times for Mass and confessions.",
    expositionInfo: "This is a permanent collection rather than a temporary exhibition. Afternoon visitation can change on holidays and special-event days.",
    sourceLabel: "Saint Anthony Chapel",
    sourceUrl: "https://pghshrines.org/faq-relics",
  }),
  record({
    id: "maria-stein-collection",
    relicName: "Shrine of the Holy Relics Collection",
    saintOrEvent: "More than 1,200 relics",
    classType: "collection",
    city: "Maria Stein",
    country: "United States",
    shrine: "Maria Stein Shrine of the Holy Relics",
    institutionType: "Shrine",
    summary: "Maria Stein houses one of the largest documented relic collections in the United States.",
    whereLocated: "At 2291 St Johns Road, Maria Stein, Ohio.",
    howToSee: "The shrine, museum, and gift shop publish regular weekly opening hours on the official site.",
    expositionInfo: "This is a permanent collection. Local liturgies and occasional closures affect access more than public removals do.",
    sourceLabel: "Maria Stein Shrine",
    sourceUrl: "https://www.mariasteinshrine.org/",
  }),
  record({
    id: "all-saints-morton-grove",
    relicName: "Shrine of All Saints Collection",
    saintOrEvent: "More than 3,200 saints",
    classType: "collection",
    city: "Morton Grove",
    country: "United States",
    shrine: "Shrine of All Saints",
    institutionType: "Shrine",
    summary: "The Shrine of All Saints holds one of the largest relic collections in the United States.",
    whereLocated: "At Saint Martha Church in Morton Grove, Illinois.",
    howToSee: "Access follows the shrine's visiting and liturgical schedule.",
    expositionInfo: "The collection is permanent rather than occasional.",
    sourceLabel: "Shrine of All Saints",
    sourceUrl: "https://shrineofallsaints.org/",
  }),
];

function buildImportedRecord(entry) {
  const city = entry.city && entry.city.trim() ? entry.city.trim() : "Various locations";
  const country = normalizeCountry(entry.country);
  const institutionType = deriveInstitutionType(entry.site);
  const accessType = entry.publicAccess || "not_specified";
  const sourceType = entry.sourceType || "official_shrine_list";
  const relicName = buildRelicName(entry.relic, entry.saint);
  const quantityNote =
    entry.quantityReportedBySource > 1
      ? `This entry is item ${entry.inventoryOrdinal} of ${entry.quantityReportedBySource} reported by the source.`
      : "";

  return record({
    id: entry.id,
    relicName,
    saintOrEvent: entry.saint || "Unspecified saint",
    classType: "unspecified",
    city,
    country,
    shrine: entry.site,
    institutionType,
    summary: `${entry.site} lists ${relicName} in its published inventory or custody record.`,
    whereLocated: `Listed at ${entry.site}, ${city}, ${country}.`,
    howToSee: accessSentence(accessType),
    expositionInfo: `Access recorded as ${ACCESS_LABELS[accessType].toLowerCase()}. Source type: ${SOURCE_TYPE_LABELS[sourceType]}. Authenticity status in this directory: reported by host institution.`,
    accessType,
    sourceType,
    sourceKey: entry.sourceKey || "",
    sourceLabel: entry.sourceTitle || SOURCE_TYPE_LABELS[sourceType],
    sourceUrl: entry.sourceUrl,
    authenticityStatus: entry.authenticityStatus || "reported_by_source",
    confidence: entry.confidence || "standard",
    sourceItemText: entry.sourceItemText || "",
    quantityReportedBySource: entry.quantityReportedBySource || 1,
    inventoryOrdinal: entry.inventoryOrdinal || 1,
    notes: [entry.sourceItemText, quantityNote, entry.notes].filter(Boolean).join(" "),
  });
}

const importedDatabase = window.RELIC_IMPORT_DB || { entries: [], sources: [], entryCount: 0, generatedAt: "" };
const importedRelics = importedDatabase.entries.map(buildImportedRecord);
const relics = [...curatedRelics, ...importedRelics];

function buildSiteHighlights(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    const city = entry.city || "Various locations";
    if (city === "Various locations") {
      return;
    }

    const key = `${entry.shrine}__${city}__${entry.country}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        title: entry.shrine,
        city,
        country: entry.country,
        institutionType: entry.institutionType,
        count: 0,
        accessTypes: new Set(),
        sourceTypes: new Set(),
        query: city,
      });
    }

    const site = grouped.get(key);
    site.count += 1;
    site.accessTypes.add(entry.accessLabel);
    site.sourceTypes.add(entry.sourceTypeLabel);
  });

  return [...grouped.values()]
    .sort((left, right) => right.count - left.count || left.city.localeCompare(right.city))
    .slice(0, 6)
    .map((site) => ({
      title: site.title,
      city: site.city,
      country: site.country,
      institutionType: site.institutionType,
      count: site.count,
      summary: `${site.count} imported records in the current directory. Access pattern: ${[...site.accessTypes][0]}.`,
      query: site.query,
    }));
}

const featuredDestinations = [
  {
    image: IMAGES.vatican,
    category: "ITALY",
    title: "Vatican City and Rome",
    description: "Apostolic tombs, Roman relic churches, and the densest concentration of globally significant Catholic relics.",
    query: "Rome",
  },
  {
    image: IMAGES.paris,
    category: "FRANCE",
    title: "Paris",
    description: "Passion relics, Rue du Bac, and the major shrine churches of the French capital.",
    query: "Paris",
  },
  {
    image: IMAGES.seville,
    category: "SPAIN",
    title: "Seville",
    description: "Royal relics, cathedral treasuries, and feast-day shrine openings tied to the city's sacred history.",
    query: "Seville",
  },
  {
    image: IMAGES.cologne,
    category: "GERMANY",
    title: "Cologne",
    description: "One of Europe's strongest cathedral reliquary environments, anchored by the Shrine of the Three Kings.",
    query: "Cologne",
  },
  {
    image: IMAGES.krakow,
    category: "POLAND",
    title: "Krakow",
    description: "Modern saint shrines, Divine Mercy devotion, and linked records for Saint Faustina and Saint John Paul II.",
    query: "Krakow",
  },
  {
    image: IMAGES.goa,
    category: "INDIA",
    title: "Goa",
    description: "A major missionary shrine city centered on the body of Saint Francis Xavier.",
    query: "Goa",
  },
];

const pilgrimageRoutes = [
  {
    slug: "apostolic-traditions",
    image: IMAGES.vatican,
    scope: "Apostolic tradition",
    title: "Apostolic tombs and apostolic memory",
    description: "Vatican City, Rome, Santiago de Compostela, and Chennai.",
    cities: ["Vatican City", "Rome", "Santiago de Compostela", "Chennai"],
    matchTerms: ["Saint Peter", "Saint Paul", "Saint James", "Saint Thomas", "Apostle"],
  },
  {
    slug: "marian-relics-and-shrines",
    image: IMAGES.paris,
    scope: "Marian relics",
    title: "Marian relics and Marian devotion",
    description: "Paris and records connected to Marian shrines, titles, and devotional objects.",
    cities: ["Paris"],
    matchTerms: ["Mary", "Marian", "Our Lady", "Miraculous Medal", "Rue du Bac", "Madonna"],
  },
  {
    slug: "passion-relics",
    image: IMAGES.paris,
    scope: "Passion relics",
    title: "Passion relics and Christological objects",
    description: "Paris, Turin, Valencia, and other records tied to the Passion and the Last Supper tradition.",
    cities: ["Paris", "Turin", "Valencia"],
    matchTerms: ["Passion of Christ", "Crown of Thorns", "Shroud", "Holy Chalice", "Last Supper"],
  },
  {
    slug: "royal-and-cathedral-treasuries",
    image: IMAGES.seville,
    scope: "Royal shrines",
    title: "Royal chapels and cathedral treasuries",
    description: "Seville, Cologne, Valencia, and cathedral sites where relics structure civic and royal memory.",
    cities: ["Seville", "Cologne", "Valencia"],
    matchTerms: ["Ferdinand", "Royal Chapel", "Three Kings", "Cathedral"],
  },
  {
    slug: "franciscan-traditions",
    image: IMAGES.assisi,
    scope: "Franciscan sites",
    title: "Franciscan and mendicant shrine traditions",
    description: "Assisi, Padua, and San Giovanni Rotondo.",
    cities: ["Assisi", "Padua", "San Giovanni Rotondo"],
    matchTerms: ["Saint Francis", "Saint Anthony", "Padre Pio", "Pio of Pietrelcina"],
  },
  {
    slug: "divine-mercy-and-modern-saints",
    image: IMAGES.krakow,
    scope: "Modern saints",
    title: "Divine Mercy and modern saint sanctuaries",
    description: "Krakow and related modern-devotion shrine records.",
    cities: ["Krakow", "San Giovanni Rotondo"],
    matchTerms: ["Faustina", "John Paul", "Divine Mercy", "Padre Pio"],
  },
  {
    slug: "missionary-relics",
    image: IMAGES.goa,
    scope: "Missionary memory",
    title: "Missionary relics and global evangelization memory",
    description: "Goa, Chennai, and records tied to missionary saints and apostolic preaching.",
    cities: ["Goa", "Chennai"],
    matchTerms: ["Francis Xavier", "Thomas the Apostle", "Missionary"],
  },
  {
    slug: "american-relic-collections",
    image: IMAGES.padua,
    scope: "Collection centers",
    title: "American relic collections and touring inventories",
    description: "Pittsburgh, Livonia, Maria Stein, Morton Grove, Rochester, and Cincinnati.",
    cities: ["Pittsburgh", "Livonia", "Maria Stein", "Morton Grove", "Rochester", "Cincinnati", "Elmira", "Greece"],
    matchTerms: ["Collection", "Custody", "Exposition", "Relic list", "Relic museum"],
  },
];

const editorialFeature = {
  image: IMAGES.assisi,
  eyebrow: "Editorial feature",
  title: "Assisi remains one of the clearest places to read relics through place, memory, and liturgy.",
  description:
    "The basilicas of Saint Francis and Saint Clare, together with the Sanctuary of the Spoliation, make Assisi unusually coherent as a sacred landscape. It is one of the best examples of how shrine records, urban form, and devotional continuity can still be read together.",
  linkLabel: "Read Assisi records",
  linkHref: "./atlas.html?q=Assisi",
};

const footerColumns = [
  {
    title: "Destinations",
    links: [
      { label: "Vatican City", href: "./atlas.html?q=Vatican%20City" },
      { label: "Rome", href: "./atlas.html?q=Rome" },
      { label: "Paris", href: "./atlas.html?q=Paris" },
      { label: "Seville", href: "./atlas.html?q=Seville" },
      { label: "Krakow", href: "./atlas.html?q=Krakow" },
      { label: "Goa", href: "./atlas.html?q=Goa" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Pittsburgh", href: "./atlas.html?q=Pittsburgh" },
      { label: "Livonia", href: "./atlas.html?q=Livonia" },
      { label: "Maria Stein", href: "./atlas.html?q=Maria%20Stein" },
      { label: "Morton Grove", href: "./atlas.html?q=Morton%20Grove" },
      { label: "Rochester", href: "./atlas.html?q=Rochester" },
      { label: "Cincinnati", href: "./atlas.html?q=Cincinnati" },
    ],
  },
  {
    title: "Browse",
    links: [
      { label: "First-Class relics", href: "./atlas.html?class=first" },
      { label: "Associated relics", href: "./atlas.html?class=associated" },
      { label: "Collection records", href: "./atlas.html?class=collection" },
      { label: "Imported records", href: "./atlas.html?class=unspecified" },
      { label: "Temporary expositions", href: "./atlas.html?access=temporary_exposition" },
      { label: "Permanent displays", href: "./atlas.html?access=permanent_display" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Directory", href: "./atlas.html" },
      { label: "Record classes", href: "./index.html#classes" },
      { label: "Collections", href: "./index.html#collections" },
      { label: "Routes", href: "./index.html#routes" },
      { label: "Editorial feature", href: "./index.html#editorial" },
      { label: "GitHub Pages", href: "./README.md" },
    ],
  },
];

const siteHighlights = buildSiteHighlights(importedRelics);

window.RELICS_ATLAS = {
  meta: {
    title: "Catholic Relics Directory",
    subtitle: "A searchable directory of relic shrines, cathedral treasuries, public collections, and source-based inventories.",
    note: "The directory combines curated shrine records with imported inventory data. Always confirm local access before visiting in person.",
    lastUpdated: importedDatabase.generatedAt || "2026-04-06",
    importedEntryCount: importedDatabase.entryCount || importedRelics.length,
    importedSourceCount: (importedDatabase.sources || []).length,
  },
  relics,
  featuredDestinations,
  pilgrimageRoutes,
  featuredCollections: siteHighlights,
  editorialFeature,
  footerColumns,
  spotlightIds: [
    "st-peter-tomb",
    "crown-of-thorns",
    "ferdinand-seville",
    "three-kings-cologne",
    "faustina-krakow",
    "francis-xavier-goa",
    "anthony-chapel-pittsburgh",
    "maria-stein-collection",
  ],
  sourceCatalog: importedDatabase.sources || [],
};
