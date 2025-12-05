// Helper function to generate avatar URL from name
const getAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=128&background=random&color=fff&bold=true`;
};

const orgData = {
  name: "Sarah Johnson",
  role: "Chief Executive Officer",
  photo: getAvatarUrl("Sarah Johnson"),
  children: [
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      photo: getAvatarUrl("Michael Chen"),
      children: [
        {
          name: "Emily Rodriguez",
          role: "VP of Engineering",
          photo: getAvatarUrl("Emily Rodriguez"),
          children: [
            {
              name: "David Kim",
              role: "Senior Engineering Manager",
              photo: getAvatarUrl("David Kim"),
              children: [
                {
                  name: "Alex Thompson",
                  role: "Lead Software Engineer",
                  photo: getAvatarUrl("Alex Thompson"),
                },
                {
                  name: "Jessica Martinez",
                  role: "Lead Software Engineer",
                  photo: getAvatarUrl("Jessica Martinez"),
                },
                {
                  name: "Ryan O'Brien",
                  role: "Senior Software Engineer",
                  photo: getAvatarUrl("Ryan O'Brien"),
                },
              ],
            },
            {
              name: "Lisa Wang",
              role: "Engineering Manager",
              photo: getAvatarUrl("Lisa Wang"),
              children: [
                {
                  name: "James Wilson",
                  role: "Software Engineer",
                  photo: getAvatarUrl("James Wilson"),
                },
                {
                  name: "Maria Garcia",
                  role: "Software Engineer",
                  photo: getAvatarUrl("Maria Garcia"),
                },
                {
                  name: "Robert Taylor",
                  role: "Junior Software Engineer",
                  photo: getAvatarUrl("Robert Taylor"),
                },
              ],
            },
            {
              name: "Kevin Brown",
              role: "Engineering Manager",
              photo: getAvatarUrl("Kevin Brown"),
              children: [
                {
                  name: "Amanda Lee",
                  role: "Software Engineer",
                  photo: getAvatarUrl("Amanda Lee"),
                },
                {
                  name: "Christopher Davis",
                  role: "Software Engineer",
                  photo: getAvatarUrl("Christopher Davis"),
                },
              ],
            },
          ],
        },
        {
          name: "Daniel Park",
          role: "VP of Product",
          photo: getAvatarUrl("Daniel Park"),
          children: [
            {
              name: "Sophie Anderson",
              role: "Product Manager",
              photo: getAvatarUrl("Sophie Anderson"),
              children: [
                {
                  name: "Nathan Clark",
                  role: "Product Designer",
                  photo: getAvatarUrl("Nathan Clark"),
                },
                {
                  name: "Olivia White",
                  role: "UX Researcher",
                  photo: getAvatarUrl("Olivia White"),
                },
              ],
            },
            {
              name: "Thomas Moore",
              role: "Product Manager",
              photo: getAvatarUrl("Thomas Moore"),
              children: [
                {
                  name: "Isabella Harris",
                  role: "Product Designer",
                  photo: getAvatarUrl("Isabella Harris"),
                },
              ],
            },
          ],
        },
        {
          name: "Jennifer Liu",
          role: "VP of Infrastructure",
          photo: getAvatarUrl("Jennifer Liu"),
          children: [
            {
              name: "William Jackson",
              role: "DevOps Manager",
              photo: getAvatarUrl("William Jackson"),
              children: [
                {
                  name: "Emma Davis",
                  role: "DevOps Engineer",
                  photo: getAvatarUrl("Emma Davis"),
                },
                {
                  name: "Lucas Miller",
                  role: "DevOps Engineer",
                  photo: getAvatarUrl("Lucas Miller"),
                },
              ],
            },
            {
              name: "Rachel Green",
              role: "Security Manager",
              photo: getAvatarUrl("Rachel Green"),
              children: [
                {
                  name: "Benjamin Wright",
                  role: "Security Engineer",
                  photo: getAvatarUrl("Benjamin Wright"),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Robert Williams",
      role: "Chief Financial Officer",
      photo: getAvatarUrl("Robert Williams"),
      children: [
        {
          name: "Patricia Johnson",
          role: "VP of Finance",
          photo: getAvatarUrl("Patricia Johnson"),
          children: [
            {
              name: "Matthew Lewis",
              role: "Finance Manager",
              photo: getAvatarUrl("Matthew Lewis"),
              children: [
                {
                  name: "Ashley Young",
                  role: "Financial Analyst",
                  photo: getAvatarUrl("Ashley Young"),
                },
                {
                  name: "Joshua King",
                  role: "Financial Analyst",
                  photo: getAvatarUrl("Joshua King"),
                },
              ],
            },
            {
              name: "Nicole Scott",
              role: "Accounting Manager",
              photo: getAvatarUrl("Nicole Scott"),
              children: [
                {
                  name: "Andrew Adams",
                  role: "Accountant",
                  photo: getAvatarUrl("Andrew Adams"),
                },
                {
                  name: "Samantha Baker",
                  role: "Accountant",
                  photo: getAvatarUrl("Samantha Baker"),
                },
              ],
            },
          ],
        },
        {
          name: "Steven Turner",
          role: "VP of Operations",
          photo: getAvatarUrl("Steven Turner"),
          children: [
            {
              name: "Michelle Hall",
              role: "Operations Manager",
              photo: getAvatarUrl("Michelle Hall"),
              children: [
                {
                  name: "Brandon Hill",
                  role: "Operations Coordinator",
                  photo: getAvatarUrl("Brandon Hill"),
                },
                {
                  name: "Lauren Carter",
                  role: "Operations Coordinator",
                  photo: getAvatarUrl("Lauren Carter"),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Elizabeth Martinez",
      role: "Chief Marketing Officer",
      photo: getAvatarUrl("Elizabeth Martinez"),
      children: [
        {
          name: "Richard Phillips",
          role: "VP of Marketing",
          photo: getAvatarUrl("Richard Phillips"),
          children: [
            {
              name: "Catherine Evans",
              role: "Marketing Manager",
              photo: getAvatarUrl("Catherine Evans"),
              children: [
                {
                  name: "Jonathan Collins",
                  role: "Marketing Specialist",
                  photo: getAvatarUrl("Jonathan Collins"),
                },
                {
                  name: "Stephanie Reed",
                  role: "Marketing Specialist",
                  photo: getAvatarUrl("Stephanie Reed"),
                },
                {
                  name: "Tyler Bell",
                  role: "Content Writer",
                  photo: getAvatarUrl("Tyler Bell"),
                },
              ],
            },
            {
              name: "Angela Cooper",
              role: "Marketing Manager",
              photo: getAvatarUrl("Angela Cooper"),
              children: [
                {
                  name: "Justin Ward",
                  role: "Digital Marketing Specialist",
                  photo: getAvatarUrl("Justin Ward"),
                },
                {
                  name: "Brittany Torres",
                  role: "Social Media Manager",
                  photo: getAvatarUrl("Brittany Torres"),
                },
              ],
            },
          ],
        },
        {
          name: "Kenneth Rivera",
          role: "VP of Sales",
          photo: getAvatarUrl("Kenneth Rivera"),
          children: [
            {
              name: "Melissa Peterson",
              role: "Sales Manager",
              photo: getAvatarUrl("Melissa Peterson"),
              children: [
                {
                  name: "Derek Gray",
                  role: "Sales Representative",
                  photo: getAvatarUrl("Derek Gray"),
                },
                {
                  name: "Heather Ramirez",
                  role: "Sales Representative",
                  photo: getAvatarUrl("Heather Ramirez"),
                },
                {
                  name: "Zachary Flores",
                  role: "Sales Representative",
                  photo: getAvatarUrl("Zachary Flores"),
                },
              ],
            },
            {
              name: "Rebecca Wood",
              role: "Sales Manager",
              photo: getAvatarUrl("Rebecca Wood"),
              children: [
                {
                  name: "Jordan Butler",
                  role: "Sales Representative",
                  photo: getAvatarUrl("Jordan Butler"),
                },
                {
                  name: "Megan Simmons",
                  role: "Sales Representative",
                  photo: getAvatarUrl("Megan Simmons"),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "David Anderson",
      role: "Chief Human Resources Officer",
      photo: getAvatarUrl("David Anderson"),
      children: [
        {
          name: "Nancy Foster",
          role: "VP of Human Resources",
          photo: getAvatarUrl("Nancy Foster"),
          children: [
            {
              name: "Gregory Sanders",
              role: "HR Manager",
              photo: getAvatarUrl("Gregory Sanders"),
              children: [
                {
                  name: "Victoria Price",
                  role: "HR Specialist",
                  photo: getAvatarUrl("Victoria Price"),
                },
                {
                  name: "Eric Bennett",
                  role: "HR Specialist",
                  photo: getAvatarUrl("Eric Bennett"),
                },
                {
                  name: "Kimberly Wood",
                  role: "Recruiter",
                  photo: getAvatarUrl("Kimberly Wood"),
                },
              ],
            },
            {
              name: "Deborah Barnes",
              role: "Talent Acquisition Manager",
              photo: getAvatarUrl("Deborah Barnes"),
              children: [
                {
                  name: "Sean Ross",
                  role: "Recruiter",
                  photo: getAvatarUrl("Sean Ross"),
                },
                {
                  name: "Amy Henderson",
                  role: "Recruiter",
                  photo: getAvatarUrl("Amy Henderson"),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default orgData;
