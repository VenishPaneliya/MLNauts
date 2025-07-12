// JavaScript Example: Reading Entities
// Filterable fields: title, brand, category, subcategory, style, size, condition, description, tags, images, rewards_value, status, views, owner_id
async function fetchItemEntities() {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/Item, {
        headers: {
            'api_key': '4724b9ae86104a0a86cb0112b469d731', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, brand, category, subcategory, style, size, condition, description, tags, images, rewards_value, status, views, owner_id
async function updateItemEntity(entityId, updateData) {
    const response = await fetch(https://app.base44.com/api/apps/68722722c3cec763af2d9881/entities/Item/${entityId}, {
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
