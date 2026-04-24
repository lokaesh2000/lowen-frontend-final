export const DEMO_ASSUMPTIONS = [
  'Multi-input calibration uses a macro trailer image and a micro tape image together to achieve sub-inch precision.',
  'Scale consistency assumes the DOT-C2 tape provides the main spatial reference along the visible trailer side.',
  'This demo is optimized for Amazon, Coca-Cola, Costco, Walmart, and FedEx logo detection and ink-yield estimation.',
  'For best unwarping results, capture the trailer from a near-parallel side angle and avoid extreme perspective.',
];

export const DEMO_IMAGE_GROUPS = [
  {
    id: 'fedex-a',
    macro: {
      id: 'fedex-a-macro',
      title: 'FedEx Trailer A',
      assetPath: '/demo-images/macro-fedex-a.svg',
      fileName: 'macro-fedex-a.svg',
    },
    microOptions: [
      {
        id: 'fedex-a-micro-1',
        title: 'FedEx Tape A',
        assetPath: '/demo-images/micro-fedex-a-1.svg',
        fileName: 'micro-fedex-a-1.svg',
      },
      {
        id: 'fedex-a-micro-2',
        title: 'FedEx Tape B',
        assetPath: '/demo-images/micro-fedex-a-2.svg',
        fileName: 'micro-fedex-a-2.svg',
      },
    ],
  },
  {
    id: 'amazon-a',
    macro: {
      id: 'amazon-a-macro',
      title: 'Amazon Trailer A',
      assetPath: '/demo-images/macro-amazon-a.svg',
      fileName: 'macro-amazon-a.svg',
    },
    microOptions: [
      {
        id: 'amazon-a-micro-1',
        title: 'Amazon Tape A',
        assetPath: '/demo-images/micro-amazon-a-1.svg',
        fileName: 'micro-amazon-a-1.svg',
      },
      {
        id: 'amazon-a-micro-2',
        title: 'Amazon Tape B',
        assetPath: '/demo-images/micro-amazon-a-2.svg',
        fileName: 'micro-amazon-a-2.svg',
      },
    ],
  },
  {
    id: 'walmart-a',
    macro: {
      id: 'walmart-a-macro',
      title: 'Walmart Trailer A',
      assetPath: '/demo-images/macro-walmart-a.svg',
      fileName: 'macro-walmart-a.svg',
    },
    microOptions: [
      {
        id: 'walmart-a-micro-1',
        title: 'Walmart Tape A',
        assetPath: '/demo-images/micro-walmart-a-1.svg',
        fileName: 'micro-walmart-a-1.svg',
      },
      {
        id: 'walmart-a-micro-2',
        title: 'Walmart Tape B',
        assetPath: '/demo-images/micro-walmart-a-2.svg',
        fileName: 'micro-walmart-a-2.svg',
      },
    ],
  },
];
