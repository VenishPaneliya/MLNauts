import React, { useState, useRef } from "react";
import { Item } from "@/entities/Item";
import { User } from "@/entities/User";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Camera, X, Plus, Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    subcategory: "",
    style: "",
    size: "",
    condition: "",
    description: "",
    tags: [],
    images: [],
    rewards_value: 0
  });

  const [newTag, setNewTag] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const handleImageUpload = async (files) => {
    setLoading(true);
    try {
      const imagePromises = Array.from(files).map(async (file) => {
        const { file_url } = await UploadFile({ file });
        return file_url;
      });
      
      const imageUrls = await Promise.all(imagePromises);
      setUploadedImages(prev => [...prev, ...imageUrls]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));

      // Analyze first image with AI
      if (imageUrls.length > 0 && !formData.title) {
        analyzeWithAI(imageUrls[0]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async (imageUrl) => {
    setAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: Analyze this fashion item image and provide details. Return a JSON object with: title, brand (from the predefined list or "Other"), category (men/women/accessories), subcategory, condition (new/like_new/good/fair/poor), style, estimated_rewards_value (10-500 points), tags (array of 3-5 relevant tags), and description.,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            brand: { type: "string" },
            category: { type: "string" },
            subcategory: { type: "string" },
            condition: { type: "string" },
            style: { type: "string" },
            estimated_rewards_value: { type: "number" },
            tags: { type: "array", items: { type: "string" } },
            description: { type: "string" }
          }
        }
      });

      if (response) {
        setFormData(prev => ({
          ...prev,
          title: response.title || "",
          brand: response.brand || "",
          category: response.category || "",
          subcategory: response.subcategory || "",
          condition: response.condition || "",
          style: response.style || "",
          description: response.description || "",
          tags: response.tags || [],
          rewards_value: response.estimated_rewards_value || 0
        }));
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await Item.create({
        ...formData,
        owner_id: user.id
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Item Listed Successfully!</h2>
          <p className="text-stone-600 mb-6">Your item is now available for swapping.</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="rewear-button">
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-stone-800 mb-2">List Your Item</h1>
          <p className="text-stone-600">Share your fashion pieces with the ReWear community</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rewear-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center cursor-pointer hover:border-stone-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                    <UploadIcon className="w-12 h-12 mx-auto mb-4 text-stone-400" />
                    <p className="text-stone-600 font-medium mb-2">Upload Photos</p>
                    <p className="text-stone-500 text-sm">Click or drag images here</p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={Upload ${index + 1}}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {analyzing && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                      <span className="text-blue-800 font-medium">AI is analyzing your item...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Item Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rewear-card border-0">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Vintage Denim Jacket"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Brand</label>
                      <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Gucci", "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's", "Calvin Klein", "Tommy Hilfiger", "Prada", "Louis Vuitton", "Chanel", "Dior", "Versace", "Balenciaga", "Other"].map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Size</label>
                      <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12", "One Size"].map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Condition</label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like_new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your item..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {formData.rewards_value > 0 && (
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">Estimated Value</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-700">
                        {formData.rewards_value} ReWards
                      </div>
                      <p className="text-amber-600 text-sm">Based on brand, condition, and demand</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.images.length}
              className="rewear-button text-lg px-8 py-4 rounded-full"
            >
              {loading ? 'Listing Item...' : 'List Item'}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
