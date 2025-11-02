
### Issue 6: Blank Page in Browser
**Troubleshooting:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Ensure backend is running (`npm start` in server)
5. Verify MongoDB is connected

---

## 📚 Testing the Application

### 1. **User Registration:**
   - Go to http://localhost:3000
   - Click "Signup"
   - Fill in details (email, password, name, etc.)
   - Click "Signup"

### 2. **Patient Test:**
   - Login as patient
   - Click "Take Cognitive Test"
   - Fill patient information
   - Complete all test sections
   - Submit test

### 3. **View Results:**
   - Click "View Test Results"
   - See all answers with questions
   - View scoring
   - Edit AI probability
   - Download PDF report

### 4. **Doctor Dashboard:**
   - Login as doctor
   - Click "Doctor Dashboard"
   - View all patients
   - Click "View Details" for any patient
   - See their test results

---

## 🔐 Security Notes

⚠️ **Before Deployment:**
1. Change `JWT_SECRET` in `.env` file
2. Use strong passwords for database
3. Enable MongoDB authentication
4. Use HTTPS instead of HTTP
5. Set `NODE_ENV=production`
6. Hide `.env` file from version control

---

## 📞 Support & Contact

If you encounter any issues:
1. Check the **Troubleshooting** section above
2. Open browser DevTools (F12) for error messages
3. Check MongoDB connection
4. Verify all services are running

---

## 📄 License

This project is for educational purposes.

---

## 👥 Team Members

- **Sharath** - Lead Developer
- **Your Teammate** - Add your name here

---

## 🎯 Quick Start Checklist

- [ ] Node.js installed and verified
- [ ] MongoDB installed and verified
- [ ] Project extracted to desired location
- [ ] `/server/.env` file created
- [ ] Server dependencies installed (`npm install`)
- [ ] Client dependencies installed (`npm install`)
- [ ] MongoDB running (`mongod`)
- [ ] Backend running (`npm start` in server)
- [ ] Frontend running (`npm run dev` in client)
- [ ] Application loaded at `http://localhost:3000`

---

## 🚀 Next Steps

After successful installation:
1. Create a test account
2. Take a cognitive test
3. View results and download report
4. Explore doctor dashboard

**Happy Testing!** 🎉
# ad_detection
