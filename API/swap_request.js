// JavaScript Example: Reading Entities
// Filterable fields: requester_id, owner_id, requested_item_id, offered_item_id, points_offered, message, status, type, delivery_tracking_id
async function fetchSwapRequestEntities() {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/SwapRequest, {
        headers: {
            'api_key': '4724b9ae86104a0a86cb0112b469d731', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: requester_id, owner_id, requested_item_id, offered_item_id, points_offered, message, status, type, delivery_tracking_id
async function updateSwapRequestEntity(entityId, updateData) {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/SwapRequest/${entityId}, {
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
