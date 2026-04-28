import { useMemo, useState } from 'react';
import {
  AvailableDonationList,
  DonationFilters,
  RecipientPageLayout,
  SummaryCard,
} from '@/features/recipient-dashboard/components';
import {
  availableDonations,
  donationFoodTypeOptions,
  recipientSummaryCards,
} from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

export default function RecipientDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('all');

  const filteredDonations = useMemo(() => {
    return availableDonations.filter((donation) => {
      const keyword = searchQuery.trim().toLowerCase();
      const matchKeyword =
        !keyword ||
        donation.storeName.toLowerCase().includes(keyword) ||
        donation.menuDescription.toLowerCase().includes(keyword) ||
        donation.category.toLowerCase().includes(keyword);

      const matchType =
        selectedFoodType === 'all' || donation.categoryKey === selectedFoodType;

      return matchKeyword && matchType;
    });
  }, [searchQuery, selectedFoodType]);

  return (
    <RecipientPageLayout title="Recipients Dashboard">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {recipientSummaryCards.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-h4 font-semibold text-text">Daftar Donasi yang Tersedia</h2>
          <DonationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedFoodType}
            onTypeChange={setSelectedFoodType}
            typeOptions={donationFoodTypeOptions}
          />
          <AvailableDonationList donations={filteredDonations} />
        </section>
      </section>
    </RecipientPageLayout>
  );
}
