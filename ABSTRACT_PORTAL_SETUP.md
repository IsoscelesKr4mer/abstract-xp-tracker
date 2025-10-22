# Abstract Portal XP Integration Setup

## 🎯 **What This Achieves**

Your Abstract XP Tracker will now show **real global Abstract Portal XP data** from the official Abstract ecosystem instead of just users who visit your site.

## 🔑 **Step 1: Get Abstract Portal API Key**

1. **Visit**: https://docs.abs.xyz/api-reference
2. **Sign up** for Abstract Portal API access
3. **Get your API key** from the Abstract dashboard
4. **Note**: Abstract Portal XP is the official reward system shown in the [Portal documentation](https://docs.abs.xyz/portal/overview#what-is-xp)

## ⚙️ **Step 2: Configure Environment Variables**

### **Local Development:**
```bash
# In backend/.env
ABSTRACT_API_KEY=your-actual-abstract-api-key-here
```

### **Production (Railway):**
1. Go to your Railway project dashboard
2. Add environment variable:
   - **Key**: `ABSTRACT_API_KEY`
   - **Value**: Your actual Abstract Portal API key

## 🚀 **Step 3: Understanding Abstract Portal XP**

According to the [Abstract Portal documentation](https://docs.abs.xyz/portal/overview#what-is-xp):

- **XP is earned** by using Abstract apps listed on the Discover page
- **Updated weekly** and reflected in rewards profile
- **Not transferable** between accounts
- **Can be lost** for cheating or breaking rules
- **Shows real ecosystem engagement** across all Abstract users

## 📊 **What You'll Get**

### **Before (Local Users Only):**
- Only users who visit your site
- Limited to your database
- Not representative of Abstract ecosystem

### **After (Global Abstract Data):**
- ✅ **All Abstract wallet users globally**
- ✅ **Cross-app XP aggregation**
- ✅ **Real ecosystem rankings**
- ✅ **Accurate user positioning**

## 🔄 **Fallback Behavior**

If XP Protocol API is not configured or fails:
- **Graceful fallback** to local database
- **Clear indication** of data source
- **No broken functionality**

## 🧪 **Testing**

### **Test API Connection:**
```bash
curl -X GET "https://api.xp-protocol.io/query-scores?limit=10" \
  -H "X-API-KEY: your-api-key"
```

### **Check Your Backend:**
```bash
curl "https://abstract-xp-tracker-production.up.railway.app/api/leaderboard/global?limit=10"
```

## 📈 **Expected Results**

After setup:
1. **Real wallet addresses** from Abstract ecosystem
2. **Actual XP totals** across all Abstract apps
3. **Global rankings** showing true ecosystem position
4. **Cross-app activity** data

## 🎯 **Next Steps**

1. **Get XP Protocol API key**
2. **Add to Railway environment variables**
3. **Create XP Protocol project**
4. **Deploy and test**

Your leaderboard will then show **real global Abstract ecosystem data**! 🚀
