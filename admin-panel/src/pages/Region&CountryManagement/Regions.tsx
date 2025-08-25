import React, { useState, useEffect } from "react";
import { Plus, Search, Globe } from "lucide-react";
import { Button } from "../../components/common/Button";
import { ExportCSVButton } from "../../components/common/ExportCSVButton";
import { RegionTable } from "./components/RegionTable";
import { RegionFormModal } from "./components/RegionFormModal";
import { CountryFormModal } from "./components/CountryFormModal";
import { Region } from "../../models/entity/Region";
import { Country } from "../../models/entity/Country";
import { CountryTable } from "./components/CountryTable";
import { GenericLayout } from "../../components/layout/Layout";
import { useRegionsAndCountries } from "../../DataManagers/regionDataManager";
import { countryService } from "../../services/countryService";

const Regions: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const regionData = useRegionsAndCountries();
    const {
      regions = [],
      regionLoading: isLoading = false,
      refetchRegions,
      createRegion,
      updateRegion,
    } = regionData || {};

    const [countries, setCountries] = useState<Country[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
      name: "",
      countryId: "",
    });
    // Country table state
    const [countryTable, setCountryTable] = useState<Country[]>([]);
    const [countryTableLoading, setCountryTableLoading] = useState(false);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
    const [countryFormData, setCountryFormData] = useState({ name: "" });
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [activePane, setActivePane] = useState<"region" | "country">("region");
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const MAX_FETCH_ATTEMPTS = 1;

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (fetchAttempts < MAX_FETCH_ATTEMPTS) {
          setFetchAttempts((prev) => prev + 1);
          await Promise.all([fetchCountries(), fetchCountryTable()]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setFetchError('Failed to initialize data');
      }
    };

    initializeData();
  }, [fetchAttempts]);

  // Filter regions based on search term
  const filteredRegions = React.useMemo(() => {
    try {
      if (!Array.isArray(regions)) return [];
      if (searchTerm.trim() === "") return regions;
      return regions.filter(
        (region) =>
          region?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          region?.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering regions:', error);
      return [];
    }
  }, [searchTerm, regions]);

  // Safe fetch countries function
  const fetchCountries = async () => {
    try {
      setFetchError(null);
      const response = await countryService.getCountries();
      const countryData = response?.data ?? response;
      setCountries(Array.isArray(countryData) ? countryData : []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setFetchError("Failed to fetch countries");
      setCountries([]);
    }
  };

  // Safe fetch country table function
  const fetchCountryTable = async () => {
    try {
      setCountryTableLoading(true);
      setFetchError(null);
      const response = await countryService.getCountries();
      const countryData = response?.data ?? response;
      setCountryTable(Array.isArray(countryData) ? countryData : []);
    } catch (error) {
      console.error('Error fetching country table:', error);
      setFetchError("Failed to fetch country table");
      setCountryTable([]);
    } finally {
      setCountryTableLoading(false);
    }
  };

  // Region handlers with error protection
  const handleAdd = () => {
    try {
      setEditingRegion(null);
      setFormData({
        name: "",
        countryId: "",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening add region modal:', error);
    }
  };

  const handleEdit = (region: Region) => {
    try {
      if (!region) {
        console.error('Invalid region data for editing');
        return;
      }
      setEditingRegion(region);
      setFormData({
        name: region.name || "",
        countryId: region.country?.id?.toString() || "",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening edit region modal:', error);
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    countryId: string;
  }) => {
    try {
      if (!formData.name.trim()) {
        alert('Region name is required');
        return;
      }

      if (editingRegion && editingRegion.id !== undefined) {
        if (updateRegion) {
          await updateRegion(editingRegion.id.toString(), formData);
        }
      } else {
        if (createRegion) {
          await createRegion(formData);
        }
      }
      
      // Reset fetch attempts before manual refetch
      setFetchAttempts(0);
      if (refetchRegions) {
        await refetchRegions();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting region form:', error);
      alert('Failed to save region. Please try again.');
    }
  };

  // Country handlers with error protection
  const handleCountryAdd = () => {
    try {
      setEditingCountry(null);
      setCountryFormData({ name: "" });
      setIsCountryModalOpen(true);
    } catch (error) {
      console.error('Error opening add country modal:', error);
    }
  };

  const handleCountryEdit = (country: Country) => {
    try {
      if (!country) {
        console.error('Invalid country data for editing');
        return;
      }
      setEditingCountry(country);
      setCountryFormData({ name: country.name || "" });
      setIsCountryModalOpen(true);
    } catch (error) {
      console.error('Error opening edit country modal:', error);
    }
  };

  const handleCountryDelete = async (id: number) => {
    try {
      if (!id) {
        console.error('Invalid country ID for deletion');
        return;
      }
      if (window.confirm("Are you sure you want to delete this country?")) {
        // TODO: Implement delete logic using countryService
        // Example: await countryService.deleteCountry(id.toString());
        
        // Reset fetch attempts before manual refetch
        setFetchAttempts(0);
        await fetchCountryTable();
      }
    } catch (error) {
      console.error('Error deleting country:', error);
      alert('Failed to delete country. Please try again.');
    }
  };

  // Safe filtered countries with error handling
  const filteredCountries = React.useMemo(() => {
    try {
      if (!Array.isArray(countryTable)) return [];
      if (countrySearchTerm.trim() === "") return countryTable;
      return countryTable.filter((country) =>
        country?.name?.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering countries:', error);
      return [];
    }
  }, [countrySearchTerm, countryTable]);

  const handleCountrySubmit = async (formData: any) => {
    try {
      if (!formData?.name?.trim()) {
        alert('Country name is required');
        return;
      }

      // TODO: Implement add/edit logic using countryService
      // Example:
      // if (editingCountry) {
      //   await countryService.updateCountry(editingCountry.id!.toString(), formData);
      // } else {
      //   await countryService.createCountry(formData);
      // }
      setIsCountryModalOpen(false);
      
      // Reset fetch attempts before manual refetch
      setFetchAttempts(0);
      await fetchCountryTable();
    } catch (error) {
      console.error('Error submitting country form:', error);
      alert('Failed to save country. Please try again.');
    }
  };

  // Error section with safe error handling
  const errorSection = fetchError && (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <span className="text-red-700 font-medium">{fetchError}</span>
      <Button 
        variant="outline" 
        className="ml-4" 
        onClick={async () => {
          try {
            setFetchError(null);
            setFetchAttempts(0);
            if (refetchRegions) {
              await refetchRegions();
            }
            await Promise.all([fetchCountries(), fetchCountryTable()]);
          } catch (error) {
            console.error('Error retrying fetch:', error);
          }
        }}
      >
        Retry
      </Button>
    </div>
  );

  // Pane Switch with error protection
  const paneSwitch = (
    <div className="flex border-b mb-4">
      <button
        className={`px-4 py-2 ${
          activePane === "region"
            ? "border-b-2 border-blue-600 font-semibold"
            : ""
        }`}
        onClick={() => {
          try {
            setActivePane("region");
          } catch (error) {
            console.error('Error switching to region pane:', error);
          }
        }}
      >
        Region Management
      </button>
      <button
        className={`px-4 py-2 ${
          activePane === "country"
            ? "border-b-2 border-blue-600 font-semibold"
            : ""
        }`}
        onClick={() => {
          try {
            setActivePane("country");
          } catch (error) {
            console.error('Error switching to country pane:', error);
          }
        }}
      >
        Country Management
      </button>
    </div>
  );

  // Filters with error protection
  const regionFilters = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by region name or country..."
          value={searchTerm}
          onChange={(e) => {
            try {
              setSearchTerm(e.target.value);
            } catch (error) {
              console.error('Error updating search term:', error);
            }
          }}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <Button onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" /> Add Region
      </Button>
    </div>
  );

  const countryFilters = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by country name..."
          value={countrySearchTerm}
          onChange={(e) => {
            try {
              setCountrySearchTerm(e.target.value);
            } catch (error) {
              console.error('Error updating country search term:', error);
            }
          }}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <Button onClick={handleCountryAdd} variant="outline">
        <Globe className="w-4 h-4 mr-2" /> Add Country
      </Button>
    </div>
  );

  // Table
  const regionTablePane = (
    <>
      <ExportCSVButton data={filteredRegions} filename="regions.csv" />
      <RegionTable
        regions={filteredRegions}
        loading={isLoading}
        onEdit={handleEdit}
      />
      <RegionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={false}
        editingRegion={editingRegion}
        formData={formData}
        setFormData={setFormData}
        countries={countries}
      />
    </>
  );

  const countryTablePane = (
    <>
      <ExportCSVButton data={filteredCountries} filename="countries.csv" />
      <CountryTable
        countries={filteredCountries}
        loading={countryTableLoading}
        onEdit={handleCountryEdit}
      />
      <CountryFormModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        onSubmit={handleCountrySubmit}
        submitting={false}
        formData={countryFormData}
        setFormData={setCountryFormData}
      />
    </>
  );

  // Table & Modal per pane
  const table = (
    <>
      {paneSwitch}
      {activePane === "region" ? regionTablePane : countryTablePane}
    </>
  );

  // Modal (already included in table section)
  const modal = null;

  // Header
  const title =
    activePane === "region" ? "Region Management" : "Country Management";
  const subtitle =
    activePane === "region"
      ? "Manage regions and their countries"
      : "Manage countries";

  return (
    <GenericLayout
      title={title}
      subtitle={subtitle}
      filters={activePane === "region" ? regionFilters : countryFilters}
      buttons={null}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
  } catch (error) {
    console.error('Error rendering Regions page:', error);
    return (
      <GenericLayout
        title="Region & Country Management"
        subtitle="Error loading page"
        filters={null}
        buttons={null}
        errorSection={
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">Page Error</h3>
              <p className="text-red-600 mb-4">Failed to load regions and countries management</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        }
        table={null}
        modal={null}
      />
    );
  }
};

export default Regions;
