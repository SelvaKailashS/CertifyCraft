import type { Participant } from '../types';

export const DEMO_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    college: 'Indian Institute of Technology, Bombay',
    email: 'aarav.sharma@iitb.ac.in',
    certificateId: 'CC-HKT-2026-081',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Winner - 1st Place',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '2',
    name: 'Sneha Patel',
    college: 'National Institute of Technology, Karnataka',
    email: 'sneha.patel@nitk.edu.in',
    certificateId: 'CC-HKT-2026-082',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Runner Up - 2nd Place',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '3',
    name: 'Rohan Deshmukh',
    college: 'College of Engineering, Pune',
    email: 'deshmukh.r@coep.ac.in',
    certificateId: 'CC-HKT-2026-083',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: '2nd Runner Up - 3rd Place',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '4',
    name: 'Ananya Iyer',
    college: 'Birla Institute of Technology and Science, Pilani',
    email: 'ananya.iyer@pilani.bits-pilani.ac.in',
    certificateId: 'CC-HKT-2026-084',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Best Innovation Award',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '5',
    name: 'Vikram Malhotra',
    college: 'Delhi Technological University',
    email: 'vikram.m@dtu.ac.in',
    certificateId: 'CC-HKT-2026-085',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Finalist - Top 10',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '6',
    name: 'Pooja Reddy',
    college: 'International Institute of Information Technology, Hyderabad',
    email: 'pooja.reddy@iiit.ac.in',
    certificateId: 'CC-HKT-2026-086',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Best Technical Design',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '7',
    name: 'Kabir Mehta',
    college: 'Jadavpur University',
    email: 'kabir.m@ju.edu.in',
    certificateId: 'CC-HKT-2026-087',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Special Mention',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
  {
    id: '8',
    name: 'Meera Nambiar',
    college: 'PSG College of Technology, Coimbatore',
    email: 'meera.n@psgtech.ac.in',
    certificateId: 'CC-HKT-2026-088',
    eventTitle: 'National 36-Hour AI Hackathon',
    date: 'October 15, 2026',
    rank: 'Participant',
    description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
  },
];

export function generateStressTestParticipants(count: number = 4000): Participant[] {
  const firstNames = [
    'Aarav', 'Sneha', 'Rohan', 'Ananya', 'Vikram', 'Pooja', 'Kabir', 'Meera',
    'Aditya', 'Riya', 'Karthik', 'Diya', 'Arjun', 'Isha', 'Varun', 'Tanvi',
    'Siddharth', 'Nisha', 'Rahul', 'Divya', 'Gaurav', 'Tara', 'Kunal', 'Shruti'
  ];
  const lastNames = [
    'Sharma', 'Patel', 'Deshmukh', 'Iyer', 'Malhotra', 'Reddy', 'Mehta', 'Nambiar',
    'Gupta', 'Verma', 'Kumar', 'Menon', 'Joshi', 'Bose', 'Nair', 'Chopra',
    'Saxena', 'Kapoor', 'Rao', 'Bhat', 'Singhania', 'Sen', 'Pillai', 'Chawla'
  ];
  const colleges = [
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'NIT Trichy',
    'NIT Surathkal', 'BITS Pilani', 'IIIT Hyderabad', 'DTU Delhi', 'COEP Pune',
    'PSG Tech Coimbatore', 'Jadavpur University', 'Vellore Institute of Technology', 'SRM University'
  ];
  const ranks = [
    'Winner - 1st Place', 'Runner Up - 2nd Place', '2nd Runner Up - 3rd Place',
    'Best Innovation Award', 'Finalist - Top 10', 'Best Technical Design', 'Special Mention', 'Participant'
  ];

  const list: Participant[] = [];
  for (let i = 1; i <= count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const name = `${fn} ${ln}`;
    const college = colleges[(i * 7) % colleges.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@university.edu`;
    const certId = `CC-HKT-2026-${String(i).padStart(4, '0')}`;
    const rank = ranks[i % ranks.length];

    list.push({
      id: String(i),
      name,
      college,
      email,
      certificateId: certId,
      eventTitle: 'National 36-Hour AI Hackathon',
      date: 'October 15, 2026',
      rank,
      description: 'for actively participating and showcasing exceptional engineering skills during the National 36-Hour Hackathon.',
    });
  }
  return list;
}
