import React, { useState, useEffect } from "react";
import { FormModal } from "../../components/common/FormModal";
import { Trip } from "../../models/entity/Trip";
import { useTrips } from "../../DataManagers/tripDataManager";
import { GenericLayout } from "../../components/layout/Layout";
import { logger } from "../../utils";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { TripFilters } from "./sections/TripFilters";
import { TripActions } from "./sections/TripActions";
import { TripTable } from "./components/TripTable";

const log = logger.forSource('TripsPage');

function Trips() {
     // Safe hook usage with error handling
     const tripData = useTrips();
     const {
       trips = [],
       loading: isLoading = false,
       // error intentionally unused; retain for future UI
       refetch,
     } = tripData || {};

     const [fetchError, setFetchError] = useState<string | null>(null);
     const [fetchAttempts, setFetchAttempts] = useState(0);
     const MAX_FETCH_ATTEMPTS = 1;

     // Safe useEffect with error handling
     useEffect(() => {
       try {
         if (
           Array.isArray(trips) &&
           trips.length === 0 &&
           !isLoading &&
           !fetchError &&
           fetchAttempts < MAX_FETCH_ATTEMPTS
         ) {
           setFetchAttempts((prev) => prev + 1);
           refetch?.().catch((err: unknown) => {
             log.error('Error fetching trips', err as unknown);
             const msg = typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : undefined;
             setFetchError(typeof msg === 'string' ? msg : "Failed to fetch trips.");
           });
         }
       } catch (error) {
         log.error('Error in useEffect', error as unknown);
         setFetchError('Failed to load trips data');
       }
     }, [trips, isLoading, fetchError, fetchAttempts, refetch]);

     // Safe refresh handler
     const handleRefresh = async () => {
       try {
         setFetchError(null);
         setFetchAttempts(0);
         await refetch?.();
       } catch (error) {
         log.error('Error refreshing trips', error as unknown);
         setFetchError('Failed to refresh trips');
       }
     };
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
     const [searchTerm, setSearchTerm] = useState("");
     const [formData, setFormData] = useState({
       title: "",
       description: "",
       isActive: true,
     });

     // Filter trips based on search term with error handling
     const filteredTrips = React.useMemo(() => {
       try {
         if (!Array.isArray(trips)) {
           console.warn('Trips is not an array:', trips);
           return [];
         }

         if (searchTerm.trim() === "") return trips;

         return trips.filter((trip: Trip) => {
           try {
             const title = trip?.title || '';
             const description = trip?.description || '';
             const searchLower = searchTerm.toLowerCase();

             return (
               title.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower)
             );
           } catch (error) {
             log.error('Error filtering trip', { error, trip } as unknown);
             return false;
           }
         });
       } catch (error) {
         log.error('Error in filteredTrips', error as unknown);
         return [];
       }
     }, [searchTerm, trips]);

     // Safe handlers with error handling
     const handleAdd = () => {
       try {
         setEditingTrip(null);
         setFormData({
           title: "",
           description: "",
           isActive: true,
         });
         setIsModalOpen(true);
       } catch (error) {
         log.error('Error opening add modal', error as unknown);
       }
     };

     const handleEdit = (trip: Trip) => {
       try {
         setEditingTrip(trip);
         setFormData({
           title: trip?.title || "",
           description: trip?.description || "",
           isActive: trip?.isActive ?? true,
         });
         setIsModalOpen(true);
       } catch (error) {
         log.error('Error opening edit modal', error as unknown);
       }
     };

     const handleDelete = async (id: number) => {
       try {
         if (window.confirm("Are you sure you want to delete this trip?")) {
           try {
             // TODO: Implement deleteTrip in useTrips/tripService
             // await tripService.deleteTrip(id.toString());
             console.log('Delete trip with ID:', id);
             refetch?.();
           } catch (error) {
             log.error("Error deleting trip", error as unknown);
           }
         }
       } catch (error) {
         log.error('Error in delete handler', error as unknown);
       }
     };

     // Filters section
     const filters = (
       <TripFilters
         searchTerm={searchTerm}
         setSearchTerm={setSearchTerm}
         total={trips.length}
         filtered={filteredTrips.length}
       />
     );

     // Buttons section
     const buttons = (
       <TripActions onAdd={handleAdd} />
     );

     // Error section
     const errorSection = fetchError ? (
       <ErrorBanner message={fetchError} onRetry={handleRefresh} className="mb-4" />
     ) : null;

     // Table section
     const table = (
       <TripTable
         trips={filteredTrips}
         loading={isLoading && !fetchError}
         onEdit={handleEdit}
         onDelete={(id) => {
           try { handleDelete(id); } catch (e) { log.error('Delete from table failed', e as unknown); }
         }}
       />
     );

     // Modal section
     const modal = (
       <FormModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title={editingTrip ? "Edit Trip" : "Add New Trip"}
         fields={[
           { name: 'title', label: 'Trip Title', type: 'text', required: true },
           { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
           { name: 'isActive', label: 'Active', type: 'checkbox' }
         ]}
         value={formData}
         onChange={setFormData}
         onSubmit={async () => {
           try {
             if (editingTrip) {
               // TODO: updateTrip
             } else {
               // TODO: createTrip
             }
             setIsModalOpen(false);
             await refetch?.();
           } catch (error) {
             log.error("Error saving trip", error as unknown);
           }
         }}
         submitLabel={editingTrip ? 'Update Trip' : 'Create Trip'}
       />
     );

     return (
       <GenericLayout
         title={PAGE_TITLES.TRIP_MANAGEMENT}
         subtitle={PAGE_SUBTITLES.TRIP_MANAGEMENT}
         filters={filters}
         buttons={buttons}
         errorSection={errorSection}
         table={table}
         modal={modal}
       />
     );
}

export default Trips;
