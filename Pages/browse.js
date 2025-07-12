import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Item } from "@/entities/Item";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Browse() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const categoryFromUrl = urlParams.get('category');

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    loadItems();
    loadUser();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedCategory, selectedBrand, selectedCondition, sortBy]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await Item.list('-created_date');
      const availableItems = allItems.filter(item => item.status === 'available');
      setItems(availableItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }

    if (selectedCondition !== "all") {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => (a.rewards_value || 0) - (b.rewards_value || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.rewards_value || 0) - (a.rewards_value || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    setFilteredItems(filtered);
  };

  const handleItemClick = async (item) => {
    // Increment views
    try {
      await Item.update(item.id, { views: (item.views || 0) + 1 });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const conditionColors = {
    new: "bg-green-100 text-green-800",
    like_new: "bg-blue-100 text-blue-800",
    good: "bg-yellow-100 text-yellow-800",
    fair: "bg-orange-100 text-orange-800",
    poor: "bg-red-100 text-red-800"
  };

  const uniqueBrands = [...new Set(items.map(item => item.brand))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-stone-800 mb-2">
            {categoryFromUrl ? ${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Fashion : 'Browse Items'}
          </h1>
          <p className="text-stone-600">Discover unique pieces from our sustainable fashion community</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rewear-card rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  placeholder="Search items, brands, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-stone-200 focus:border-stone-400"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {uniqueBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like_new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600">
            {loading ? 'Loading...' : ${filteredItems.length} items found}
          </p>
          {filteredItems.length > 0 && (
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="overflow-hidden">
                  <div className="bg-stone-200 h-64 w-full" />
                  <CardContent className="p-4">
                    <div className="bg-stone-200 h-4 w-3/4 mb-2 rounded" />
                    <div className="bg-stone-200 h-3 w-1/2 mb-4 rounded" />
                    <div className="bg-stone-200 h-6 w-1/3 rounded" />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-stone-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-600 mb-2">No items found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Link 
                  to={createPageUrl(ItemDetail?id=${item.id})}
                  onClick={() => handleItemClick(item)}
                >
                  <Card className="rewear-card border-0 overflow-hidden h-full cursor-pointer group">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className={conditionColors[item.condition]}>
                          {item.condition.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-stone-800">
                          {item.brand}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-stone-400" />
                          <span className="text-xs text-stone-500">{item.views || 0}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.subcategory}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-amber-700 font-bold text-lg">
                          {item.rewards_value || 0} ReWards
                        </div>
                        <Button size="sm" variant="ghost" className="p-1">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-stone-100 text-stone-600">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-600">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Load More */}
        {filteredItems.length > 0 && filteredItems.length % 12 === 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="bg-white border-stone-300 hover:bg-stone-50">
              Load More Items
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
