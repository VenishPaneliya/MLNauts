import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  RefreshCw, 
  Heart, 
  Globe, 
  Star,
  Upload,
  Search,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredItems = [
    { id: 1, title: "Vintage Denim Jacket", brand: "Levi's", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop", price: "150 ReWards" },
    { id: 2, title: "Designer Silk Scarf", brand: "Gucci", image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=400&fit=crop", price: "200 ReWards" },
    { id: 3, title: "Casual Sneakers", brand: "Nike", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop", price: "120 ReWards" },
    { id: 4, title: "Elegant Dress", brand: "Zara", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop", price: "180 ReWards" },
  ];

  const testimonials = [
    { name: "Sarah Chen", rating: 5, text: "ReWear transformed my wardrobe sustainably. I've swapped over 20 items and earned enough points for designer pieces!", avatar: "https://images.unsplash.com/photo-1494790108755-2616b09f3c4f?w=60&h=60&fit=crop&crop=face" },
    { name: "Marcus Johnson", rating: 5, text: "The quality verification is amazing. Every item I've received has been exactly as described. Love the community!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" },
    { name: "Elena Rodriguez", rating: 5, text: "Finally, a sustainable way to refresh my style. The ReWards system makes it so easy to try new brands.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200" />
        <div className="absolute inset-0 bg-pattern opacity-30" style={{
          backgroundImage: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-gradient-to-r from-stone-700 via-amber-800 to-stone-600 bg-clip-text"
          >
            Swap. Save. Sustain.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed"
          >
            Join the sustainable fashion revolution. Exchange clothing with our community
            <br />
            and earn ReWards for every swap.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={createPageUrl("Browse")}>
              <Button size="lg" className="rewear-button text-lg px-8 py-4 rounded-full">
                Start Swapping <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Browse")}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2 border-stone-300 hover:border-stone-400">
                <Search className="mr-2 w-5 h-5" />
                Browse Items
              </Button>
            </Link>
            <Link to={createPageUrl("Upload")}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2 border-amber-300 hover:border-amber-400 text-amber-700 hover:bg-amber-50">
                <Upload className="mr-2 w-5 h-5" />
                List an Item
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Featured Items</h2>
            <p className="text-stone-600 text-lg">Discover unique pieces from our community</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="rewear-card border-0 overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                    <p className="text-stone-600 text-sm mb-3">{item.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700 font-bold">{item.price}</span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-r from-stone-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-800 mb-4">How ReWear Works</h2>
            <p className="text-stone-600 text-lg">Simple steps to sustainable fashion</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Upload, title: "Upload Your Items", desc: "Take photos and list items you no longer wear. Our AI estimates their ReWards value.", color: "from-green-400 to-emerald-500" },
              { icon: RefreshCw, title: "Swap or Redeem", desc: "Exchange items directly with other users or use ReWards points to get what you want.", color: "from-blue-400 to-cyan-500" },
              { icon: Heart, title: "Refresh Your Style", desc: "Receive quality-verified items and enjoy your refreshed wardrobe sustainably.", color: "from-pink-400 to-rose-500" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="text-center"
              >
                <div className={w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-4">{step.title}</h3>
                <p className="text-stone-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-stone-100" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Globe className="w-16 h-16 mx-auto mb-8 text-emerald-600" />
            <h2 className="text-4xl font-bold text-stone-800 mb-6">Our Mission</h2>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              We believe fashion should be sustainable, accessible, and community-driven. 
              By connecting people who love style with those ready to share, we're reducing 
              waste and creating a circular economy that benefits everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { number: "50K+", label: "Items Swapped" },
                { number: "15K+", label: "Active Members" },
                { number: "2M+", label: "ReWards Earned" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-3xl font-bold text-amber-700 mb-2">{stat.number}</div>
                  <div className="text-stone-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-800 mb-4">What Our Community Says</h2>
            <p className="text-stone-600 text-lg">Real stories from real swappers</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="rewear-card border-0 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-stone-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-stone-800">{testimonial.name}</div>
                        <div className="text-stone-500 text-sm">Verified Swapper</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-stone-800 to-amber-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Wardrobe?</h2>
            <p className="text-xl text-stone-200 mb-8">
              Join thousands of fashion lovers who are making sustainable choices every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Browse")}>
                <Button size="lg" className="bg-white text-stone-800 hover:bg-stone-100 text-lg px-8 py-4 rounded-full">
                  <Zap className="mr-2 w-5 h-5" />
                  Start Swapping Now
                </Button>
              </Link>
              <Link to={createPageUrl("Upload")}>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-stone-800 text-lg px-8 py-4 rounded-full">
                  Upload Your First Item
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">ReWear</h3>
              <p className="text-stone-400 leading-relaxed mb-6">
                The sustainable fashion platform connecting style lovers worldwide. 
                Swap, earn, and refresh your wardrobe responsibly.
              </p>
              <div className="flex gap-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("Help")} className="hover:text-white transition-colors">Help Center</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-400">
              © 2024 ReWear. All rights reserved. Made with ♥ for sustainable fashion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
