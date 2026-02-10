export interface Winner {
  sno: number;
  name: string;
  gender: 'M' | 'F';
  bibNo: number;
  category: string;
  school: string;
  dob: string;
}

export interface CategoryWinners {
  categoryName: string;
  categoryId: string;
  winners: Winner[];
}

export interface GenderSeparatedWinners {
  baseCategory: string;
  baseCategoryId: string;
  positions: PositionWinners[];
}

export interface PositionWinners {
  position: string;
  positionLabel: string;
  male: Winner[];
  female: Winner[];
}

export const winnersData: Winner[] = [
  // 10K>18Y
  {
    sno: 1,
    name: 'M S J VEDAVHYAS',
    gender: 'M',
    bibNo: 10033,
    category: '10K>18Y WINNER',
    school: 'Vizag',
    dob: '11/10/02',
  },
  {
    sno: 2,
    name: 'K HEMANTH',
    gender: 'M',
    bibNo: 10113,
    category: '10K>18Y 1st RUNNER UP',
    school: 'Choppella',
    dob: '17/07/2005',
  },
  {
    sno: 3,
    name: 'JOGI SATISH',
    gender: 'M',
    bibNo: 10062,
    category: '10K>18Y 2nd RUNNER UP',
    school: 'Irusumanda',
    dob: '30/01/2001',
  },
  {
    sno: 4,
    name: 'T SUREKHA RATNAM',
    gender: 'F',
    bibNo: 10114,
    category: '10K>18Y WINNER',
    school: '',
    dob: '3/1/05',
  },
  {
    sno: 5,
    name: 'JAYA KAMESHWARI',
    gender: 'F',
    bibNo: 10099,
    category: '10K>18Y 1st RUNNER UP',
    school: 'Vijayawada',
    dob: '15/4/1972',
  },
  {
    sno: 6,
    name: 'D N VARA LAKSHMI DEVI',
    gender: 'F',
    bibNo: 10104,
    category: '10K>18Y 2nd RUNNER UP',
    school: 'Lolla',
    dob: '30/01/1987',
  },

  // 10K<18Y
  {
    sno: 7,
    name: 'SRINU KILO',
    gender: 'M',
    bibNo: 10069,
    category: '10K<18Y WINNER',
    school: '',
    dob: '1/1/08',
  },
  {
    sno: 8,
    name: 'K G SIVA SAI SAIRAM',
    gender: 'M',
    bibNo: 10007,
    category: '10K<18Y 1st RUNNER UP',
    school: '',
    dob: '26/04/2004',
  },
  {
    sno: 9,
    name: 'Y NIKHILENDRA',
    gender: 'M',
    bibNo: 10023,
    category: '10K<18Y 2nd RUNNER UP',
    school: 'ST PATRICS',
    dob: '',
  },
  {
    sno: 10,
    name: 'N VIJAYA',
    gender: 'F',
    bibNo: 10124,
    category: '10K<18Y WINNER',
    school: 'CHEMUDU LANKA',
    dob: '14/1/12',
  },
  {
    sno: 11,
    name: 'K LAVANYA',
    gender: 'F',
    bibNo: 10141,
    category: '10K<18Y 1st RUNNER UP',
    school: '',
    dob: '12/8/11',
  },
  {
    sno: 12,
    name: 'S VARSHINI',
    gender: 'F',
    bibNo: 10140,
    category: '10K<18Y 2nd RUNNER UP',
    school: '',
    dob: '13/11/2011',
  },

  // 5K>18Y
  {
    sno: 13,
    name: 'PRADEEP',
    gender: 'M',
    bibNo: 5073,
    category: '5K>18Y WINNER',
    school: '',
    dob: '',
  },
  {
    sno: 14,
    name: 'PRAMAVATI ESWAR',
    gender: 'M',
    bibNo: 5182,
    category: '5K>18Y 1st RUNNER UP',
    school: '',
    dob: '21/3/2006',
  },
  {
    sno: 15,
    name: 'V LOKESH',
    gender: 'M',
    bibNo: 5159,
    category: '5K>18Y 2nd RUNNER UP',
    school: '',
    dob: '',
  },
  {
    sno: 16,
    name: 'D BHAVANI',
    gender: 'F',
    bibNo: 5128,
    category: '5K>18Y WINNER',
    school: 'Vijayawada',
    dob: '1/8/97',
  },
  {
    sno: 17,
    name: 'VARA LAKSHMI',
    gender: 'F',
    bibNo: 5022,
    category: '5K>18Y 1st RUNNER UP',
    school: 'Park Ravulapalem',
    dob: '',
  },
  {
    sno: 18,
    name: 'G RUDRAMA DEVI',
    gender: 'F',
    bibNo: 5207,
    category: '5K>18Y 2nd RUNNER UP',
    school: 'Park Ravulapalem',
    dob: '22/6/1993',
  },

  // 5K<18Y
  {
    sno: 19,
    name: 'V RAYUDU',
    gender: 'M',
    bibNo: 5271,
    category: '5K<18Y WINNER',
    school: '',
    dob: '',
  },
  {
    sno: 20,
    name: 'K MANOJ',
    gender: 'M',
    bibNo: 5269,
    category: '5K<18Y 1st RUNNER UP',
    school: 'Pulletikurru School',
    dob: '15.12.2011',
  },
  {
    sno: 21,
    name: 'K AVINASH',
    gender: 'M',
    bibNo: 5302,
    category: '5K<18Y 2nd RUNNER UP',
    school: 'Coach Trimurthulu',
    dob: '14.09.2010',
  },
  {
    sno: 22,
    name: 'CH HARSHA VARDHINI',
    gender: 'F',
    bibNo: 5265,
    category: '5K<18Y WINNER',
    school: 'Pulletikurru School',
    dob: '10.10.2011',
  },
  {
    sno: 23,
    name: 'S SARANYA',
    gender: 'F',
    bibNo: 5107,
    category: '5K<18Y 1st RUNNER UP',
    school: 'St Patricks Rvpm',
    dob: '05.12.2011',
  },
  {
    sno: 24,
    name: 'RESHMA',
    gender: 'F',
    bibNo: 5001,
    category: '5K<18Y 2nd RUNNER UP',
    school: 'Alamuru',
    dob: '16.9.2011',
  },

  // 3K<13Y
  {
    sno: 25,
    name: 'K SHANMUK VENKATA SAI',
    gender: 'M',
    bibNo: 3164,
    category: '3K<13Y WINNER',
    school: 'CHEMUDU LANKA',
    dob: '01.11.2014',
  },
  {
    sno: 26,
    name: 'T CHANDU',
    gender: 'M',
    bibNo: 3073,
    category: '3K<13Y 1st RUNNER UP',
    school: 'MAHARSHI School Atpm',
    dob: '08.05.2013',
  },
  {
    sno: 27,
    name: 'V M V S GANESH',
    gender: 'M',
    bibNo: 3157,
    category: '3K<13Y 2nd RUNNER UP',
    school: 'CHEMUDU LANKA',
    dob: '25.11.2014',
  },
  {
    sno: 28,
    name: 'B MAHITHA',
    gender: 'F',
    bibNo: 3166,
    category: '3K<13Y WINNER',
    school: 'CHEMUDU LANKA',
    dob: '20.01.2014',
  },
  {
    sno: 29,
    name: 'M BHAVANA',
    gender: 'F',
    bibNo: 3162,
    category: '3K<13Y 1st RUNNER UP',
    school: 'CHEMUDU LANKA',
    dob: '05.06.2014',
  },
  {
    sno: 30,
    name: 'M SANJANA',
    gender: 'F',
    bibNo: 3161,
    category: '3K<13Y 2nd RUNNER UP',
    school: 'CHEMUDU LANKA',
    dob: '12.11.2014',
  },
];

export function getWinnersByCategory(): CategoryWinners[] {
  const categoryMap = new Map<string, Winner[]>();

  winnersData.forEach((winner) => {
    const category = winner.category;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(winner);
  });

  const categories: CategoryWinners[] = [];

  // Order categories in a logical way
  const categoryOrder = [
    '10K>18Y WINNER',
    '10K>18Y 1st RUNNER UP',
    '10K>18Y 2nd RUNNER UP',
    '10K<18Y WINNER',
    '10K<18Y 1st RUNNER UP',
    '10K<18Y 2nd RUNNER UP',
    '5K>18Y WINNER',
    '5K>18Y 1st RUNNER UP',
    '5K>18Y 2nd RUNNER UP',
    '5K<18Y WINNER',
    '5K<18Y 1st RUNNER UP',
    '5K<18Y 2nd RUNNER UP',
    '3K<13Y WINNER',
    '3K<13Y 1st RUNNER UP',
    '3K<13Y 2nd RUNNER UP',
  ];

  categoryOrder.forEach((category) => {
    const winners = categoryMap.get(category);
    if (winners) {
      categories.push({
        categoryName: category,
        categoryId: category.toLowerCase().replace(/\s+/g, '-'),
        winners: winners,
      });
    }
  });

  return categories;
}

export function getWinnersByCategoryAndGender(): GenderSeparatedWinners[] {
  const baseCategoryMap = new Map<string, PositionWinners[]>();

  // Extract base categories (10K>18Y, 10K<18Y, 5K>18Y, 5K<18Y, 3K<13Y)
  const baseCategories = [
    '10K>18Y',
    '10K<18Y',
    '5K>18Y',
    '5K<18Y',
    '3K<13Y',
  ];

  baseCategories.forEach((baseCategory) => {
    const positionMap = new Map<string, { male: Winner[]; female: Winner[] }>();
    const positions = ['WINNER', '1st RUNNER UP', '2nd RUNNER UP'];

    positions.forEach((position) => {
      positionMap.set(position, { male: [], female: [] });
    });

    // Filter winners for this base category
    winnersData.forEach((winner) => {
      if (winner.category.startsWith(baseCategory)) {
        const position = winner.category.replace(baseCategory, '').trim();
        const genderData = positionMap.get(position);
        if (genderData) {
          if (winner.gender === 'M') {
            genderData.male.push(winner);
          } else {
            genderData.female.push(winner);
          }
        }
      }
    });

    const positionWinners: PositionWinners[] = [];
    positions.forEach((position) => {
      const genderData = positionMap.get(position);
      if (genderData && (genderData.male.length > 0 || genderData.female.length > 0)) {
        const positionLabel =
          position === 'WINNER' ? '🥇 Winner' :
          position === '1st RUNNER UP' ? '🥈 1st Runner Up' :
          '🥉 2nd Runner Up';

        positionWinners.push({
          position,
          positionLabel,
          male: genderData.male,
          female: genderData.female,
        });
      }
    });

    if (positionWinners.length > 0) {
      baseCategoryMap.set(baseCategory, positionWinners);
    }
  });

  const result: GenderSeparatedWinners[] = [];
  baseCategories.forEach((baseCategory) => {
    const positions = baseCategoryMap.get(baseCategory);
    if (positions) {
      result.push({
        baseCategory,
        baseCategoryId: baseCategory.toLowerCase().replace(/[>/<]/g, ''),
        positions,
      });
    }
  });

    return result;
  }
