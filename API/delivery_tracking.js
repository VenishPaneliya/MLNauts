// JavaScript Example: Reading Entities
// Filterable fields: swap_request_id, tracking_number, status, estimated_delivery, carrier, timeline
async function fetchDeliveryTrackingEntities() {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/DeliveryTracking, {
        headers: {
            'api_key': '4724b9ae86104a0a86cb0112b469d731', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: swap_request_id, tracking_number, status, estimated_delivery, carrier, timeline
async function updateDeliveryTrackingEntity(entityId, updateData) {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/DeliveryTracking/${entityId}, {
        method: 'PUT',
        headers: {
            'api_key': '4724b9ae86104a0a86cb0112b469d731', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}
