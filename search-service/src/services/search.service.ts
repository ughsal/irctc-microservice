type SearchResult = {
  trainNo: string;
  trainName: string;
  source: string;
  destination: string;
};

const mockTrains: SearchResult[] = [
  {
    trainNo: "12001",
    trainName: "Shatabdi Express",
    source: "NDLS",
    destination: "Bhopal",
  },
  {
    trainNo: "12951",
    trainName: "Mumbai Rajdhani",
    source: "NDLS",
    destination: "MMCT",
  },
];

export async function searchTrains(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return mockTrains;
  }

  const normalizedQuery = query.toLowerCase();

  return mockTrains.filter((train) =>
    [train.trainNo, train.trainName, train.source, train.destination].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
}

