export interface Campaign {
  id: string;
  title: string;
  urgency: string;
  shortDescription: string;
  fullStory: string[];
  goal: number;
  raised: number;
  donors: number;
  image: string;
  organizer: string;
  beneficiary: string;
  destinationAddress: string;
}

export const campaigns: Campaign[] = [
  {
    id: "maria-recovery",
    title: "Help Maria Walk Again After Tragic Accident",
    urgency: "Urgent Medical Needs",
    shortDescription: "Maria suffered a severe injury and needs funds for physical therapy and surgery. Every USDC (XLM on testnet) goes directly to her wallet with zero fees.",
    fullStory: [
      "On the evening of May 14th, Maria was involved in a severe hit-and-run accident while walking home from her shift as a pediatric nurse. She sustained critical injuries to her spine and lower extremities. After multiple emergency surgeries, she is finally stable but faces a long, grueling road to recovery.",
      "Doctors are optimistic that with extensive physical therapy and one final specialized surgical procedure, Maria will be able to walk again. However, her insurance only covers a fraction of the necessary treatments.",
      "We are utilizing the Stellar Network to raise funds to ensure that 100% of your donation goes directly to Maria's wallet, avoiding the 5-10% fees typical of traditional crowdfunding platforms."
    ],
    goal: 5000,
    raised: 3421,
    donors: 142,
    image: "https://images.unsplash.com/photo-1538356111053-748a48e1acb8?q=80&w=1200&auto=format&fit=crop",
    organizer: "David Chen",
    beneficiary: "Maria Santos",
    destinationAddress: "GDLS5FYEH73Z4OEOARXGAZRR7TQA2Q4NNLX5PX365V3SBKQDZUN2Z6F3",
  },
  {
    id: "pediatric-heart",
    title: "Lifesaving Heart Surgery for Baby Leo",
    urgency: "Critical Care",
    shortDescription: "Baby Leo was born with a rare congenital heart defect and urgently requires open-heart surgery.",
    fullStory: [
      "Baby Leo was brought into the world just two months ago, but his fight for life began immediately. Diagnosed with a complex congenital heart defect, his tiny heart is struggling to pump oxygen-rich blood to his body.",
      "The specialized pediatric cardiology team has scheduled a lifesaving open-heart surgery for next week. The procedure is incredibly complex and requires post-operative ICU care that exceeds what the family can afford.",
      "By donating directly to their Stellar wallet, you provide immediate liquidity to Leo's family so they can secure his place in the operating room without worrying about platform withdrawal delays or fees."
    ],
    goal: 12000,
    raised: 8400,
    donors: 310,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop",
    organizer: "Sarah Jenkins",
    beneficiary: "Leo's Family",
    destinationAddress: "GDKDST4MZ3QQXAVCVB4RW7RRUO274KK5Z36ZFUK26NM35MWNPNU5CVJO",
  },
  {
    id: "typhoon-relief",
    title: "Emergency Medical Relief for Typhoon Survivors",
    urgency: "Disaster Relief",
    shortDescription: "Supplying emergency medical kits, clean water, and antibiotics to the coastal villages affected by Typhoon Amihan.",
    fullStory: [
      "Typhoon Amihan has devastated coastal communities, completely wiping out three local clinics and contaminating the primary water supply. The immediate risk is no longer just the storm, but the outbreak of waterborne diseases.",
      "Our volunteer medical team is on the ground, but we are running desperately low on basic antibiotics, sterile bandages, and water purification tablets.",
      "Traditional banking infrastructure in the region is currently down. By sending funds via the Stellar Network to our satellite-connected mobile wallet, we can instantly trade XLM/USDC for local currency with nearby operational merchants to buy supplies directly."
    ],
    goal: 10000,
    raised: 1500,
    donors: 45,
    image: "https://images.unsplash.com/photo-1527613426441-4cb50c2dd3c2?q=80&w=1200&auto=format&fit=crop",
    organizer: "Global MedRelief",
    beneficiary: "Amihan Affected Communities",
    destinationAddress: "GCA7PL3HUEFWUPDPTWXOG3UWWKT2OTDDV6X6N5HCQCB7STWVTDDOOCIL",
  }
];

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id);
}
