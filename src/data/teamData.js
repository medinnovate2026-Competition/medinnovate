const teamImage = (fileName) => `${import.meta.env.BASE_URL}team/${fileName}`;

export const teamSections = [
  {
    title: 'Presidents',
    eyebrow: 'Leadership',
    description: 'Guiding MedInnovate with cross-border healthcare, student leadership, and startup execution experience.',
    members: [
      {
        name: 'Abhishek Kashyap',
        role: 'GAIMS President',
        image: teamImage('abhishek-kashyap.svg'),
      },
      {
        name: 'Oluwasola Victor',
        role: 'CEO of BlueOzone',
        image: teamImage('oluwasola-victor.jpeg'),
      },
    ],
  },
  {
    title: 'Secretaries',
    eyebrow: 'Program Leads',
    description: 'Coordinating partner organisations, operations, communication, and the student innovation experience.',
    members: [
      {
        name: 'Girik Subudhi',
        role: 'Organising Secretary GAIMS',
        image: teamImage('girik-subudhi.jpeg'),
      },
      {
        name: 'Sofiyullah Salaudeen',
        role: 'Organising Secretary NiMSA',
        image: teamImage('sofiyullah-salaudeen.jpeg'),
      },
      {
        name: 'Elton M Mahulu',
        role: 'Organising Secretary FAMSA',
        image: teamImage('elton-m-mahulu.jpeg'),
      },
      {
        name: 'Ogunka Favour',
        role: 'Organising Secretary BlueOzone Health',
        image: teamImage('ogunka-favour.jpeg'),
      },
    ],
  },
  {
    title: 'IT Cell',
    eyebrow: 'Digital Operations',
    description: 'Building and maintaining the technical systems that power registrations, outreach, and event delivery.',
    members: [
      {
        name: 'Sushmit Morey',
        role: 'IT Cell Lead',
        image: teamImage('sushmit-morey.jpg'),
      },
      {
        name: 'Laksh',
        role: 'IT Cell Member',
        image: teamImage('laksh.svg'),
      },
      {
        name: 'Hardik Murari',
        role: 'IT Cell Member',
        image: teamImage('hardik-murari.svg'),
      },
    ],
  },
  {
    title: 'Organising Committee',
    eyebrow: 'Execution Team',
    description: 'The organising committee shaping logistics, participant experience, and the MedInnovate community.',
    members: [
      {
        name: 'Collins-Ikpe Kennedy',
        role: 'Organising Committee',
        image: teamImage('collins-ikpe-kennedy.jpeg'),
      },
      {
        name: 'Wahida Ali',
        role: 'Organising Committee',
        image: teamImage('wahida-ali.jpeg'),
      },
      {
        name: 'Awogbemi Damilola',
        role: 'Organising Committee',
        image: teamImage('awogbemi-damilola.jpeg'),
      },
      {
        name: 'Okafor Chioma Rosemary',
        role: 'Organising Committee',
        image: teamImage('okafor-chioma-rosemary.svg'),
      },
      {
        name: 'Toluwase O. Ogundipe',
        role: 'Organising Committee',
        image: teamImage('toluwase-o-ogundipe.svg'),
      },
      {
        name: 'Blessed Olaomo',
        role: 'Organising Committee',
        image: teamImage('blessed-olaomo.jpeg'),
      },
      {
        name: 'Amrit Pundir',
        role: 'Organising Committee',
        image: teamImage('amrit-pundir.jpeg'),
      },
      {
        name: 'Manasvi Mukherjee',
        role: 'Organising Committee',
        image: teamImage('manasvi-mukherjee.jpeg'),
      },
      {
        name: 'Hadi Shaikh',
        role: 'Organising Committee',
        image: teamImage('hadi-shaikh.svg'),
      },
    ],
  },
];
