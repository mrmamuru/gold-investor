import { useEffect, useState } from 'react'
import './App.css'
import './Payment.css'
import './Logo.css'
import './Gold.css'
import './GoldText.css'
import './Premium.css'
import './TrustPolish.css'
import './LivePrice.css'
import './Compliance.css'
import './LegalSupport.css'
import './Brand.css'
import './SupportPage.css'
import './AboutPage.css'
import './InvestPage.css'
import './Checkout.css'
import './ManualPayment.css'

type Tab = 'home' | 'invest' | 'wallet' | 'about' | 'support' | 'profile'
const plans = [
  { icon: '●', name: 'ডিজিটাল গোল্ড', returnRate: 'স্বর্ণের বাজারদর', minimum: '৳৫,০০০', risk: '২২ ক্যারেট', color: '#b88716' },
  { icon: '◆', name: 'মাসিক গোল্ড সেভিংস', returnRate: 'নিয়মিত সঞ্চয়', minimum: '৳৫,০০০', risk: 'ফ্লেক্সিবল', color: '#d4a72c' },
  { icon: '♛', name: 'গোল্ড SME পার্টনার', returnRate: '১২–১৮%', minimum: '৳১০,০০০', risk: 'যাচাইকৃত ব্যবসা', color: '#8b6715' },
]
const opportunities = [
  { tag: 'জুয়েলারি', title: 'রয়্যাল গোল্ড হাউস', desc: '২২ ক্যারেট অলংকার উৎপাদন ও বিক্রয়', raised: 72, amount: '৳২৪.৫ লাখ', tint: '#fff8df' },
  { tag: 'কারিগর', title: 'বাংলার স্বর্ণশিল্প', desc: 'দক্ষ স্বর্ণকার ও আধুনিক কারখানা', raised: 58, amount: '৳১৮.৭ লাখ', tint: '#f8f0d4' },
  { tag: 'SME', title: 'গোল্ড ট্রেডিং পার্টনার', desc: 'যাচাইকৃত পাইকারি স্বর্ণ ব্যবসা', raised: 84, amount: '৳৩২.২ লাখ', tint: '#fff4c2' },
]
const mobilePayments = [
  { short: 'b', name: 'bKash', color: '#e2136e', domain: 'bkash.com', logo: '/logos/bkash.png' }, { short: 'N', name: 'Nagad', color: '#f45b22', domain: 'nagad.com.bd', logo: '/logos/nagad.png' },
  { short: 'R', name: 'Rocket', color: '#8c1a88', domain: 'dutchbanglabank.com', logo: '/logos/rocket.svg' }, { short: 'U', name: 'Upay', color: '#fb8b21', domain: 'upaybd.com' },
  { short: 'T', name: 'Tap', color: '#1769aa', domain: 'trustaxiatapay.com' }, { short: 'O', name: 'OK Wallet', color: '#e22b32', domain: 'okwallet.com.bd' },
]
const banks = [
  { short: 'DBBL', name: 'Dutch-Bangla Bank', color: '#d3372e', domain:'dutchbanglabank.com' }, { short: 'CB', name: 'City Bank', color: '#d71945', domain:'thecitybank.com' },
  { short: 'BRAC', name: 'BRAC Bank', color: '#e31837', domain:'bracbank.com' }, { short: 'EBL', name: 'Eastern Bank', color: '#164194', domain:'ebl.com.bd' },
  { short: 'IBBL', name: 'Islami Bank', color: '#13804a', domain:'islamibankbd.com' }, { short: 'DBL', name: 'Dhaka Bank', color: '#046b9e', domain:'dhakabankltd.com' },
  { short: 'BA', name: 'Bank Asia', color: '#073b8c', domain:'bankasia-bd.com' }, { short: 'MTB', name: 'Mutual Trust Bank', color: '#6d1d7c', domain:'mutualtrustbank.com' },
  { short: 'PBL', name: 'Prime Bank', color: '#1677a8', domain:'primebank.com.bd' }, { short: 'UCB', name: 'UCB Bank', color: '#107a48', domain:'ucb.com.bd' },
  { short: 'SIBL', name: 'Social Islami Bank', color: '#056b4f', domain:'siblbd.com' }, { short: 'AB', name: 'AB Bank', color: '#aa2d28', domain:'abbl.com' },
  { short: 'NRBC', name: 'NRBC Bank', color: '#078032', domain:'nrbcommercialbank.com' }, { short: 'JBL', name: 'Jamuna Bank', color: '#1c6e94', domain:'jamunabankbd.com' },
  { short: 'ABL', name: 'Agrani Bank', color: '#167142', domain:'agranibank.org' }, { short: 'JAN', name: 'Janata Bank', color: '#176088', domain:'janatabank-bd.com' },
]

const translations: Record<string,string> = {
  '▣ নিরাপদ ও সহজ পেমেন্ট':'▣ Secure & easy payments',
  'অ্যাকাউন্ট ও KYC':'Account & KYC','নিরাপদে পরিচয় যাচাই করুন':'Verify your identity securely',
  'পরিমাণ বাছুন':'Choose an amount','৳৫,০০০ বা তার বেশি বিনিয়োগ করুন':'Invest ৳5,000 or more',
  'স্বর্ণ ট্র্যাক করুন':'Track your gold','ওজন ও বাজারমূল্য portfolio-তে দেখুন':'View weight and market value in your portfolio',
  'মাত্র ৳৫,০০০ থেকে আপনার gold portfolio তৈরি করুন।':'Build your gold portfolio starting from just ৳5,000.',
  'রয়্যাল গোল্ড হাউস':'Royal Gold House','বাংলার স্বর্ণশিল্প':'Banglar Gold Craft','গোল্ড ট্রেডিং পার্টনার':'Gold Trading Partner',
  'জুয়েলারি':'Jewellery','কারিগর':'Gold artisan','✓ ব্যবসা ও স্বর্ণ যাচাইকৃত':'✓ Business & gold verified',
  '২২ ক্যারেট অলংকার উৎপাদন ও বিক্রয়':'22K jewellery manufacturing & sales','দক্ষ স্বর্ণকার ও আধুনিক কারখানা':'Skilled goldsmiths & modern workshop','যাচাইকৃত পাইকারি স্বর্ণ ব্যবসা':'Verified wholesale gold business',
  '72% সংগ্রহ':'72% raised','58% সংগ্রহ':'58% raised','84% সংগ্রহ':'84% raised','৳২৪.৫ লাখ':'৳2.45M','৳১৮.৭ লাখ':'৳1.87M','৳৩২.২ লাখ':'৳3.22M',
  '২২K Hallmarked Gold':'22K Hallmarked Gold','বিশুদ্ধতা যাচাই ও নথিভুক্ত':'Purity verified and documented','নিরাপদ ভল্ট':'Secure vault','নিয়ন্ত্রিত সংরক্ষণ ব্যবস্থা':'Controlled storage system','KYC যাচাইকৃত':'KYC verified','প্রতিটি বিনিয়োগকারী সুরক্ষিত':'Every investor is protected','স্বচ্ছ বাজারমূল্য':'Transparent market price','কেনার আগে পূর্ণ হিসাব দেখুন':'See the full calculation before buying','ব্যবসা যাচাই সম্পন্ন':'Business verification complete','মূল্য ও রিটার্ন সূচক':'Price & return indicator','প্ল্যান দেখুন →':'View plan →','বিস্তারিত ও ঝুঁকি দেখুন →':'View details & risks →',
  'বিশুদ্ধ স্বর্ণে, নিরাপদ ভবিষ্যৎ':'Pure gold, a secure future','মাত্র ৳৫,০০০ থেকে':'Starting from ৳5,000','স্বর্ণে বিনিয়োগ':'invest in gold','গোল্ডে বিনিয়োগ করুন':'Invest in gold','যাচাইকৃত ২২ ক্যারেট স্বর্ণ':'Verified 22K gold','স্বচ্ছ মূল্য ও নিরাপদ ভল্ট':'Transparent price and secure vault','আজকের নির্দেশক মূল্য / ভরি':'Indicative price today / bhori','বাজারের সাথে হালনাগাদ':'Updated with the market','সর্বনিম্ন বিনিয়োগ':'Minimum investment','সুরক্ষিত ভল্ট':'Secure vault','ডিজিটাল গোল্ড':'Digital Gold','মাসিক গোল্ড সেভিংস':'Monthly Gold Savings','গোল্ড SME পার্টনার':'Gold SME Partner','স্বর্ণের বাজারদর':'Gold market price','নিয়মিত সঞ্চয়':'Regular savings','২২ ক্যারেট':'22 karat','ফ্লেক্সিবল':'Flexible','যাচাইকৃত ব্যবসা':'Verified business',
  'আপনার স্বর্ণ, আপনার সম্পদ':'Your gold, your wealth','গোল্ড ইনভেস্টমেন্ট প্ল্যান':'Gold investment plans','গোল্ড-ব্যাকড SME সুযোগ':'Gold-backed SME opportunities','স্বর্ণে বিনিয়োগ এখন সহজ':'Gold investing made simple','স্বর্ণে বিনিয়োগ করুন':'Invest in gold','আপনার Gold Portfolio':'Your Gold Portfolio','স্বর্ণ ও ওয়ালেট':'Gold & wallet','মোট গোল্ড হোল্ডিং':'Total gold holding','গোল্ড কিনুন':'Buy gold','বিশুদ্ধ স্বর্ণে, নিরাপদ ভবিষ্যৎ।':'Pure gold, a secure future.','© ২০২৬ Gold Investor. ডেমো প্রোটোটাইপ।':'© 2026 Gold Investor. Demo prototype.',
  'স্মার্ট বিনিয়োগ, সমৃদ্ধ বাংলাদেশ।':'Smart investing, a prosperous Bangladesh.','© ২০২৬ bKash Investor. ডেমো প্রোটোটাইপ।':'© 2026 bKash Investor. Demo prototype.',
  'শুরু প্ল্যান':'Starter Plan','গ্রোথ প্ল্যান':'Growth Plan','SME পার্টনার':'SME Partner','নিরাপদ আয়':'Secure Income','মাসিক সঞ্চয়':'Monthly Savings',
  'কম ঝুঁকি':'Low risk','মাঝারি ঝুঁকি':'Medium risk','বাছাইকৃত SME':'Curated SME','সর্বনিম্ন':'Minimum','৳৫০০':'৳500','৳২,০০০':'৳2,000','৳৫,০০০':'৳5,000','৳১০,০০০':'৳10,000','৳১,০০০':'৳1,000','সর্বনিম্ন ৳৫০০':'Minimum ৳500','সর্বনিম্ন ৳২,০০০':'Minimum ৳2,000','সর্বনিম্ন ৳৫,০০০':'Minimum ৳5,000','সর্বনিম্ন ৳১০,০০০':'Minimum ৳10,000','সর্বনিম্ন ৳১,০০০':'Minimum ৳1,000',
  '৮–১০%':'8–10%','১২–১৫%':'12–15%','১৬–২০%':'16–20%','৳৩২ কোটি+':'৳32 crore+','১,৮৫০+':'1,850+','৯৮.৪%':'98.4%','৬৪ জেলা':'64 districts',
  'কৃষি':'Agriculture','ফ্যাশন':'Fashion','টেক':'Technology','সবুজ বাংলা এগ্রো':'Shobuj Bangla Agro','দেশি তাঁত':'Deshi Tant','স্মার্ট ডেলিভারি':'Smart Delivery','অর্গানিক সবজি উৎপাদন':'Organic vegetable production','নারী উদ্যোক্তার পোশাক ব্র্যান্ড':'Women-led clothing brand','স্থানীয় ব্যবসার লজিস্টিকস':'Logistics for local businesses',
  '৭২% সংগ্রহ':'72% raised','৫৮% সংগ্রহ':'58% raised','৮৪% সংগ্রহ':'84% raised','৳১২.৪ লাখ':'৳1.24M','৳৮.৭ লাখ':'৳870K','৳১৮.২ লাখ':'৳1.82M',
  'আপনার টাকায়, দেশের অগ্রগতি':'Your money, Bangladesh’s progress','ছোট বিনিয়োগে':'Small investments,','বড় সম্ভাবনা':'bigger possibilities',
  'বিশ্বস্ত বাংলাদেশি SME-তে বিনিয়োগ করুন। স্বচ্ছভাবে আয় করুন, উদ্যোক্তাদের পাশে থাকুন।':'Invest in trusted Bangladeshi SMEs. Earn transparently and empower local entrepreneurs.',
  'বিনিয়োগ শুরু করুন':'Start investing','কীভাবে কাজ করে':'How it works','✓ BSEC নীতিমালা অনুসরণ':'✓ BSEC guidelines followed','✓ নিরাপদ লেনদেন':'✓ Secure transactions',
  'আপনার সম্ভাব্য আয়':'Your potential return','এই বছর':'this year','সক্রিয় বিনিয়োগকারী':'active investors','🔒 সুরক্ষিত':'🔒 Secured',
  'মোট বিনিয়োগ':'Total invested','সফল বিনিয়োগ':'Successful investments','সময়মতো রিটার্ন':'On-time returns','উদ্যোক্তা নেটওয়ার্ক':'Entrepreneur network',
  'আপনার লক্ষ্য, আপনার প্ল্যান':'Your goals, your plan','সহজ বিনিয়োগ প্ল্যান':'Simple investment plans','সব দেখুন →':'View all →','প্রত্যাশিত বার্ষিক রিটার্ন':'Expected annual return',
  'নির্বাচিত SME সুযোগ':'Featured SME opportunities','✓ যাচাইকৃত':'✓ Verified','সংগ্রহ':'raised',
  '৩টি সহজ ধাপ':'3 simple steps','বিনিয়োগ এখন আরও সহজ':'Investing is now simpler','মোবাইল থেকেই আপনার বিনিয়োগ শুরু ও পরিচালনা করুন।':'Start and manage investments from your phone.',
  'অ্যাকাউন্ট খুলুন':'Create account','জাতীয় পরিচয়পত্র দিয়ে যাচাই করুন':'Verify with your national ID','প্ল্যান বাছুন':'Choose a plan','লক্ষ্য অনুযায়ী সুযোগ নির্বাচন করুন':'Pick an opportunity for your goal','আয় দেখুন':'Track returns','রিটার্ন ও অগ্রগতি ট্র্যাক করুন':'Monitor returns and progress',
  'আজই শুরু করুন':'Get started today','আপনার ভবিষ্যৎকে আজই বিনিয়োগ করুন':'Invest in your future today','মাত্র ৳৫০০ থেকে শুরু। কোনো লুকানো চার্জ নেই।':'Start from only ৳500. No hidden charges.','ফ্রি অ্যাকাউন্ট খুলুন →':'Open a free account →',
  'বাছাইকৃত ও যাচাইকৃত':'Curated and verified','বিনিয়োগের সুযোগ':'Investment opportunities','আপনার লক্ষ্য ও ঝুঁকি গ্রহণের ক্ষমতা অনুযায়ী প্ল্যান বেছে নিন।':'Choose a plan that matches your goals and risk profile.',
  'আপনার সম্পদ':'Your assets','ওয়ালেট ও পেমেন্ট':'Wallet & payments','আপনার সুবিধামতো পেমেন্ট মাধ্যম দিয়ে টাকা যোগ করুন।':'Add funds using your preferred payment method.','মোট ব্যালেন্স':'Total balance','নিরাপদভাবে টাকা যোগ করে বিনিয়োগ শুরু করুন':'Add funds securely and start investing','＋ টাকা যোগ করুন':'＋ Add money',
  'পেমেন্ট পার্টনার':'Payment partners','বাংলাদেশের জনপ্রিয় মোবাইল ফাইন্যান্সিয়াল সার্ভিস, ব্যাংক ও কার্ড সাপোর্ট।':'Popular Bangladeshi mobile wallets, banks and cards are supported.','📱 মোবাইল ওয়ালেট':'📱 Mobile wallets','🏦 ইন্টারনেট ব্যাংকিং':'🏦 Internet banking','ডেবিট ও ক্রেডিট কার্ড':'Debit & credit cards','কার্ড ব্যবহার করুন →':'Use a card →',
  'আপনার প্রোফাইল':'Your profile','বিনিয়োগ শুরু করতে অ্যাকাউন্ট তৈরি করুন':'Create an account to begin investing','রেজিস্ট্রেশন করুন':'Register','👤 ব্যক্তিগত তথ্য':'👤 Personal information','🛡️ নিরাপত্তা':'🛡️ Security','❓ সহায়তা কেন্দ্র':'❓ Help center','📄 শর্তাবলি':'📄 Terms & conditions',
  'হোম':'Home','বিনিয়োগ':'Invest','পোর্টফোলিও':'Portfolio','প্রোফাইল':'Profile','বিস্তারিত →':'Details →','নিশ্চিত করুন':'Confirm','এগিয়ে যান':'Continue'
}
const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([bn,en])=>[en,bn]))
function translateVisibleText(language:'bn'|'en') {
  const map = language === 'en' ? translations : reverseTranslations
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const raw = node.nodeValue || '', trimmed = raw.trim()
    if (map[trimmed]) node.nodeValue = raw.replace(trimmed, map[trimmed])
  }
  if(language==='en') document.querySelectorAll('.login-form p').forEach(el=>{if(el.textContent?.includes('bKash Investor'))el.textContent='Access your Gold Investor account'})
}

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [language, setLanguage] = useState<'bn' | 'en'>('bn')
  const [modal, setModal] = useState<'register' | 'login' | 'invest' | 'orderPayment' | 'payment' | null>(null)
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('bkash-investor-session') === 'active')
  const [toast, setToast] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(plans[1])
  const [amount, setAmount] = useState('5000')
  const [goldPrice, setGoldPrice] = useState(172500)
  const [pendingInvestment, setPendingInvestment] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<typeof plans[number] | null>(null)
  const [pendingPayment, setPendingPayment] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('5000')
  const [transactionId, setTransactionId] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentError, setPaymentError] = useState('')
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const requireInvestment = (plan?:typeof plans[number]) => {
    if (!loggedIn) {
      setPendingInvestment(true)
      setPendingPlan(plan || null)
      setModal(localStorage.getItem('bkash-investor-account') ? 'login' : 'register')
      notify(language === 'bn' ? 'বিনিয়োগের আগে অ্যাকাউন্ট তৈরি বা লগইন করুন' : 'Create an account or log in before investing')
      return
    }
    if (plan) { setSelectedPlan(plan); setModal('invest') }
    else { setTab('invest'); window.scrollTo({top:0,behavior:'smooth'}) }
  }
  const openPayment = (method:string) => {
    if (/card|কার্ড/i.test(method)) {
      notify(language === 'bn' ? 'কার্ড পেমেন্টের জন্য অনুমোদিত merchant gateway প্রয়োজন' : 'Card payments require an authorised merchant gateway')
      return
    }
    if (!loggedIn) {
      setPendingPayment(method)
      setModal(localStorage.getItem('bkash-investor-account') ? 'login' : 'register')
      notify(language === 'bn' ? 'পেমেন্টের আগে অ্যাকাউন্ট তৈরি বা লগইন করুন' : 'Create an account or log in before payment')
      return
    }
    setSelectedPaymentMethod(method)
    setTransactionId(''); setPaymentProof(null); setPaymentError('')
    setModal('payment')
  }
  const submitManualPayment = () => {
    setPaymentError('')
    if (Number(paymentAmount) < 5000) return setPaymentError(language==='bn'?'সর্বনিম্ন ৳৫,০০০ লিখুন':'Minimum amount is ৳5,000')
    if (transactionId.trim().length < 6) return setPaymentError(language==='bn'?'সঠিক Transaction ID লিখুন':'Enter a valid transaction ID')
    if (!paymentProof) return setPaymentError(language==='bn'?'পেমেন্টের screenshot যোগ করুন':'Add a payment screenshot')
    if (paymentProof.size > 5*1024*1024) return setPaymentError(language==='bn'?'ছবির সর্বোচ্চ size 5MB':'Maximum image size is 5MB')
    const records = JSON.parse(localStorage.getItem('gold-investor-payment-requests') || '[]')
    records.unshift({id:`GI-${Date.now()}`,method:selectedPaymentMethod,amount:Number(paymentAmount),transactionId:transactionId.trim(),fileName:paymentProof.name,status:'pending',createdAt:new Date().toISOString()})
    localStorage.setItem('gold-investor-payment-requests',JSON.stringify(records.slice(0,20)))
    setModal(null)
    notify(language==='bn'?'পেমেন্ট রিকোয়েস্ট যাচাইয়ের জন্য জমা হয়েছে':'Payment request submitted for review')
  }
  const completeAuthentication = (name:string, returning=false) => {
    sessionStorage.setItem('bkash-investor-session','active')
    setLoggedIn(true)
    if (pendingPayment) { setSelectedPaymentMethod(pendingPayment); setModal('payment') }
    else if (pendingPlan) { setSelectedPlan(pendingPlan); setTab('invest'); setModal('invest') }
    else { setModal(null); setTab(pendingInvestment ? 'invest' : 'profile') }
    setPendingInvestment(false); setPendingPlan(null); setPendingPayment('')
    notify(language==='bn' ? (returning?`স্বাগতম, ${name}`:`${name}, আপনার অ্যাকাউন্ট তৈরি হয়েছে!`) : (returning?`Welcome back, ${name}`:`Welcome ${name}, your account is ready!`))
  }

  useEffect(() => {
    document.documentElement.lang = language
    window.setTimeout(() => translateVisibleText(language), 0)
  }, [language, tab, modal, goldPrice])
  useEffect(() => {
    const targets = document.querySelectorAll('.gold-visual .balance-card strong, .gold-price-banner b')
    if (!targets.length) return
    let priceResolved = false
    targets.forEach(target => {
      target.classList.add('live-gold-price')
      const price = document.createElement('i')
      price.setAttribute('data', '22k-1bhori-dam')
      price.textContent = language === 'bn' ? 'দাম লোড হচ্ছে…' : 'Loading price…'
      target.replaceChildren(price)
    })
    const observer = new MutationObserver(() => {
      const text = targets[0]?.textContent || ''
      const normalized = text.replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
      const value = Number(normalized.replace(/[^0-9]/g, ''))
      if (value > 50000) {
        priceResolved = true
        setGoldPrice(value)
        localStorage.setItem('gold-investor-last-price', String(value))
        localStorage.setItem('gold-investor-price-time', new Date().toISOString())
      }
    })
    observer.observe(targets[0], {subtree:true,childList:true,characterData:true})
    const script = document.createElement('script')
    script.src = `https://www.goldr.org/price.ultra.js?gold-investor=${Date.now()}`
    script.async = true
    // The provider waits for DOMContentLoaded. Because this script is added after
    // React has mounted, explicitly trigger its registered price updater.
    script.onload = () => {
      document.dispatchEvent(new Event('DOMContentLoaded'))
      window.setTimeout(() => {
        targets.forEach(target => {
          const normalized = (target.textContent || '').replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
          const value = Number(normalized.replace(/[^0-9]/g, ''))
          if (value > 50000) {
            target.textContent = `৳ ${new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-BD').format(value)}`
          }
        })
        // The third-party widget injects its own credit block beside every price.
        // Keep the card clean; the source remains identified in the update label.
        document.querySelectorAll<HTMLAnchorElement>('a[href*="goldr.org"]').forEach(link => {
          const credit = link.closest('div')
          if (credit?.textContent?.toLowerCase().includes('gold price')) credit.remove()
        })
        document.querySelectorAll('.gold-visual .balance-card span').forEach(label => {
          label.textContent = language === 'bn' ? '● আজকের লাইভ বাজারদর' : '● Today’s live market rate'
          label.setAttribute('title', language === 'bn' ? 'GoldR-এ প্রকাশিত BAJUS বাজারমূল্যের তথ্য' : 'BAJUS market-rate data published by GoldR')
        })
      }, 120)
    }
    const showFallback = () => {
      if (priceResolved) return
      const cached = Number(localStorage.getItem('gold-investor-last-price'))
      targets.forEach(target => {
        target.textContent = cached > 50000
          ? new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-BD').format(cached)
          : (language === 'bn' ? 'লাইভ মূল্য পাওয়া যায়নি' : 'Live price unavailable')
      })
    }
    script.onerror = showFallback
    document.body.appendChild(script)
    const timeout = window.setTimeout(showFallback, 10000)
    return () => { observer.disconnect(); window.clearTimeout(timeout); script.remove() }
  }, [tab, language])

  return <div className="site-shell">
    <header className="topbar"><button className="brand" onClick={() => setTab('home')} aria-label="Gold Investor home"><span className="brand-mark">GI</span><span><b>Gold</b> Investor</span></button><nav className="desktop-nav" aria-label="Main navigation"><button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>{language==='bn'?'হোম':'Home'}</button><button className={tab==='invest'?'active':''} onClick={()=>requireInvestment()}>{language==='bn'?'বিনিয়োগ':'Invest'}</button><button className={tab==='wallet'?'active':''} onClick={()=>setTab('wallet')}>{language==='bn'?'পোর্টফোলিও':'Portfolio'}</button><button className={tab==='about'?'active':''} onClick={()=>{setTab('about');window.scrollTo({top:0,behavior:'smooth'})}}>{language==='bn'?'আমাদের সম্পর্কে':'About Us'}</button><button className={tab==='support'?'active':''} onClick={()=>{setTab('support');window.scrollTo({top:0,behavior:'smooth'})}}>{language==='bn'?'সাপোর্ট':'Support'}</button><button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>● {language==='bn'?'প্রোফাইল':'Profile'}</button></nav><div className="header-actions"><div className="language-switch" role="group" aria-label="Language"><button className={language==='bn'?'active':''} onClick={() => setLanguage('bn')}>বাংলা</button><button className={language==='en'?'active':''} onClick={() => setLanguage('en')}>English</button></div>{loggedIn?<button className="login-button" onClick={()=>{sessionStorage.removeItem('bkash-investor-session');setLoggedIn(false);setTab('profile');notify(language==='bn'?'লগআউট হয়েছে':'Logged out')}}>{language==='bn'?'লগআউট':'Logout'}</button>:<button className="login-button" onClick={()=>setModal('login')}>{language==='bn'?'লগইন':'Login'}</button>}</div></header>
    <main>
      {tab === 'home' && <>
        <section className="hero-section"><div className="hero-copy"><span className="eyebrow">বিশুদ্ধ স্বর্ণে, নিরাপদ ভবিষ্যৎ</span><h1>মাত্র ৳৫,০০০ থেকে<br/><em>স্বর্ণে বিনিয়োগ</em></h1><p>যাচাইকৃত ২২ ক্যারেট স্বর্ণে বিনিয়োগ করুন। স্বর্ণের বাজারদর ও আপনার বিনিয়োগ—দুটিই একটি সহজ portfolio-তে অনুসরণ করুন।</p><div className="hero-actions"><button className="primary" onClick={() => requireInvestment()}>গোল্ডে বিনিয়োগ করুন</button><button className="ghost" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>কীভাবে কাজ করে</button></div><div className="trust-line"><span>✓ যাচাইকৃত ২২ ক্যারেট স্বর্ণ</span><span>✓ স্বচ্ছ মূল্য ও নিরাপদ ভল্ট</span></div></div><div className="hero-visual gold-visual"><div className="gold-coin">GOLD<small>22K</small></div><div className="balance-card"><small>আজকের ২২ ক্যারেট মূল্য</small><strong>৳ ১,৭২,৫০০</strong><span>● আজকের লাইভ বাজারদর</span></div><div className="float-card fc-one"><b>৳৫,০০০</b><span>সর্বনিম্ন বিনিয়োগ</span></div><div className="float-card fc-two">🔒 সুরক্ষিত ভল্ট</div></div></section>
        <section className="gold-trust"><div><i className="mini-bar"/><span><b>২২K Hallmarked Gold</b><small>বিশুদ্ধতা যাচাই ও নথিভুক্ত</small></span></div><div><i className="vault-icon">▣</i><span><b>নিরাপদ ভল্ট</b><small>নিয়ন্ত্রিত সংরক্ষণ ব্যবস্থা</small></span></div><div><i className="shield-icon">✓</i><span><b>KYC যাচাইকৃত</b><small>প্রতিটি বিনিয়োগকারী সুরক্ষিত</small></span></div><div><i className="price-icon">↗</i><span><b>স্বচ্ছ বাজারমূল্য</b><small>কেনার আগে পূর্ণ হিসাব দেখুন</small></span></div></section>
        <section className="how" id="how"><div><span>৩টি সহজ ধাপ</span><h2>স্বর্ণে বিনিয়োগ এখন সহজ</h2><p>মাত্র ৳৫,০০০ থেকে আপনার gold portfolio তৈরি করুন।</p></div><ol><li><b>১</b><span><strong>অ্যাকাউন্ট ও KYC</strong>নিরাপদে পরিচয় যাচাই করুন</span></li><li><b>২</b><span><strong>পরিমাণ বাছুন</strong>৳৫,০০০ বা তার বেশি বিনিয়োগ করুন</span></li><li><b>৩</b><span><strong>স্বর্ণ ট্র্যাক করুন</strong>ওজন ও বাজারমূল্য portfolio-তে দেখুন</span></li></ol></section>
        <PaymentSection compact onSelect={openPayment} />
        <section className="cta"><div><span>আজকের স্বর্ণ, আগামীর সম্পদ</span><h2>মাত্র ৳৫,০০০ দিয়ে Gold Investor হোন</h2><p>স্বচ্ছ বাজারমূল্য, যাচাইকৃত স্বর্ণ এবং সহজ portfolio tracking।</p></div><button className="primary white" onClick={() => requireInvestment()}>বিনিয়োগ শুরু করুন →</button></section>
      </>}
      {tab === 'invest' && <section className="dashboard-page"><div className="page-head"><span>২২ ক্যারেট • যাচাইকৃত • ভল্টে সংরক্ষিত</span><h1>স্বর্ণে বিনিয়োগ করুন</h1><p>ন্যূনতম ৳৫,০০০ থেকে gold plan বা gold-business SME বেছে নিন।</p></div><div className="gold-price-banner"><span>আজকের নির্দেশক মূল্য</span><b>৳১,৭২,৫০০ / ভরি</b><small>ডেমো মূল্য • বাস্তব লেনদেনের আগে মূল্য নিশ্চিত হবে</small></div><div className="plan-grid expanded">{plans.map((plan,i)=><PlanCard key={plan.name+i} plan={plan} onClick={()=>{setSelectedPlan(plan);setModal('invest')}}/>)}</div><OpportunitySection notify={notify}/></section>}
      {tab === 'wallet' && <section className="dashboard-page wallet-page"><div className="page-head"><span>আপনার Gold Portfolio</span><h1>স্বর্ণ ও ওয়ালেট</h1><p>স্বর্ণের ওজন, বর্তমান মূল্য এবং payment এক জায়গায় দেখুন।</p></div><div className="wallet-card"><small>মোট গোল্ড হোল্ডিং</small><strong>০.০০০ গ্রাম</strong><span>ন্যূনতম ৳৫,০০০ দিয়ে প্রথম স্বর্ণ কিনুন</span><button onClick={()=>requireInvestment()}>＋ গোল্ড কিনুন</button></div><PaymentSection onSelect={openPayment} /></section>}
      {tab === 'about' && <div className="about-page"><div className="about-intro"><span>{language==='bn'?'GOLD INVESTOR সম্পর্কে':'ABOUT GOLD INVESTOR'}</span><h1>{language==='bn'?'স্বচ্ছ ও দায়িত্বশীল স্বর্ণ বিনিয়োগ':'Transparent, responsible gold investing'}</h1><p>{language==='bn'?'স্বর্ণের বাজারমূল্য, যাচাইকরণ, ঝুঁকি এবং প্রয়োজনীয় খরচ পরিষ্কারভাবে দেখিয়ে বিনিয়োগকারীদের সচেতন সিদ্ধান্ত নিতে সহায়তা করাই আমাদের লক্ষ্য।':'Our goal is to help investors make informed decisions through clear gold pricing, verification, risk and cost information.'}</p><div><b>22K<small>{language==='bn'?'স্বর্ণের মান':'Gold standard'}</small></b><b>৳৫,০০০<small>{language==='bn'?'শুরুর পরিমাণ':'Starting amount'}</small></b><b>৬টি<small>{language==='bn'?'স্বচ্ছতার নীতি':'Trust principles'}</small></b></div></div><TrustCompliance language={language}/></div>}
      {tab === 'support' && <div className="support-page"><div className="page-head"><span>{language==='bn'?'বিশ্বস্ত সহায়তা':'TRUSTED SUPPORT'}</span><h1>{language==='bn'?'সাপোর্ট ও আইনি তথ্য':'Support & legal information'}</h1><p>{language==='bn'?'যোগাযোগ, প্রতিষ্ঠান পরিচিতি, ভল্ট এবং প্রয়োজনীয় নীতিমালা এক জায়গায়।':'Contact, company information, vault details and key policies in one place.'}</p></div><LegalSupport language={language}/></div>}
      {tab === 'profile' && <ProfilePage language={language} loggedIn={loggedIn} onRegister={()=>setModal('register')} onLogin={()=>setModal('login')} onLogout={()=>{sessionStorage.removeItem('bkash-investor-session');setLoggedIn(false)}} />}
    </main>
    <footer className="desktop-footer"><div className="brand"><span className="brand-mark">G</span><span><b>Gold</b> Investor</span></div><p>বিশুদ্ধ স্বর্ণে, নিরাপদ ভবিষ্যৎ।</p><small>© ২০২৬ Gold Investor. সর্বস্বত্ব সংরক্ষিত।</small></footer>
    <nav className="bottom-nav">{([['home','⌂','হোম'],['invest','↗','বিনিয়োগ'],['wallet','▣','পোর্টফোলিও'],['profile','●','প্রোফাইল']] as const).map(([id,icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>{if(id==='invest')requireInvestment();else setTab(id);window.scrollTo({top:0,behavior:'smooth'})}}><b>{icon}</b><span>{label}</span></button>)}</nav>
    {modal === 'register' && <RegisterForm language={language} onClose={() => {setModal(null);setPendingInvestment(false);setPendingPlan(null);setPendingPayment('')}} onSuccess={(name) => completeAuthentication(name)} />}
    {modal === 'login' && <LoginForm language={language} onClose={()=>{setModal(null);setPendingInvestment(false);setPendingPlan(null);setPendingPayment('')}} onSuccess={(name)=>completeAuthentication(name,true)} onRegister={()=>setModal('register')} />}
    {modal === 'invest' && <div className="modal-backdrop" onMouseDown={(e)=>e.currentTarget===e.target&&setModal(null)}><div className="modal" role="dialog" aria-modal="true"><button className="close" onClick={()=>setModal(null)}>×</button><h2>{selectedPlan.name}</h2><p>{selectedPlan.risk} • সর্বনিম্ন {selectedPlan.minimum}</p><label>বিনিয়োগের পরিমাণ (৳)<input type="number" value={amount} min="5000" step="500" onChange={e=>setAmount(e.target.value)} /></label><div className="estimate"><span>আনুমানিক স্বর্ণের পরিমাণ</span><b>{((Number(amount)||0)/goldPrice*11.664).toFixed(3)} গ্রাম</b></div><button className="primary full" disabled={Number(amount)<5000} onClick={()=>{setPaymentAmount(amount);setModal('orderPayment')}}>গোল্ড অর্ডার নিশ্চিত করুন</button><small>ন্যূনতম ৳৫,০০০ • চূড়ান্ত ওজন কেনার সময়কার বাজারদরে নির্ধারিত হবে।</small></div></div>}
    {modal === 'orderPayment' && <div className="modal-backdrop" onMouseDown={(e)=>e.currentTarget===e.target&&setModal(null)}><div className="modal order-payment-modal" role="dialog" aria-modal="true"><button className="close" onClick={()=>setModal(null)}>×</button><span className="checkout-label">ORDER SUMMARY</span><h2>{language==='bn'?'পেমেন্ট মাধ্যম বেছে নিন':'Choose a payment method'}</h2><div className="gold-order-summary"><div><span>{language==='bn'?'প্ল্যান':'Plan'}</span><b>{selectedPlan.name}</b></div><div><span>{language==='bn'?'বিনিয়োগ':'Investment'}</span><b>৳{Number(amount).toLocaleString(language==='bn'?'bn-BD':'en-BD')}</b></div><div><span>{language==='bn'?'আনুমানিক স্বর্ণ':'Estimated gold'}</span><b>{((Number(amount)||0)/goldPrice*11.664).toFixed(3)} {language==='bn'?'গ্রাম':'g'}</b></div></div><div className="checkout-methods">{mobilePayments.map(item=><button key={item.name} onClick={()=>openPayment(item.name)}><Logo item={item}/><span>{item.name}</span><b>›</b></button>)}<button className="checkout-card" onClick={()=>openPayment(language==='bn'?'ডেবিট/ক্রেডিট কার্ড':'Debit/Credit Card')}><i>VISA</i><span>{language==='bn'?'ডেবিট/ক্রেডিট কার্ড':'Debit/Credit Card'}</span><b>›</b></button></div><small>{language==='bn'?'পেমেন্ট সম্পন্ন হওয়ার পর চূড়ান্ত স্বর্ণের ওজন নিশ্চিত হবে।':'Final gold weight will be confirmed after payment.'}</small></div></div>}
    {modal === 'payment' && <div className="modal-backdrop" onMouseDown={(e)=>e.currentTarget===e.target&&setModal(null)}><div className="modal payment-modal manual-payment-modal" role="dialog" aria-modal="true"><button className="close" onClick={()=>setModal(null)}>×</button><span className="checkout-label">MANUAL VERIFICATION</span><h2>{language==='bn'?'পেমেন্ট জমা দিন':'Submit payment'}</h2><p>{selectedPaymentMethod} • {language==='bn'?'Send Money/Transfer করার পর তথ্য দিন':'Enter the details after Send Money/Transfer'}</p><div className="manual-warning"><b>{language==='bn'?'নিরাপত্তা সতর্কতা':'Security notice'}</b><span>{language==='bn'?'PIN বা OTP কখনো এখানে লিখবেন না।':'Never enter your PIN or OTP here.'}</span></div><label>{language==='bn'?'পেমেন্ট মাধ্যম':'Payment method'}<select value={selectedPaymentMethod} onChange={e=>{setSelectedPaymentMethod(e.target.value);setTransactionId('');setPaymentProof(null)}}>{[...mobilePayments.map(item=>item.name),'Bank Transfer'].map(name=><option key={name} value={name}>{name}</option>)}</select></label><label>{language==='bn'?'Transaction ID':'Transaction ID'}<input value={transactionId} onChange={e=>setTransactionId(e.target.value.slice(0,40))} placeholder="e.g. 8N7A2X..." autoComplete="off"/></label><label>{language==='bn'?'পরিমাণ (৳)':'Amount (৳)'}<input type="number" value={paymentAmount} min="5000" step="500" onChange={e=>setPaymentAmount(e.target.value)}/></label><label className="proof-upload"><span>{paymentProof?`✓ ${paymentProof.name}`:(language==='bn'?'পেমেন্ট screenshot যোগ করুন':'Add payment screenshot')}</span><small>JPG, PNG, WEBP • Max 5MB</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPaymentProof(e.target.files?.[0]||null)}/></label>{paymentError&&<div className="form-error">⚠ {paymentError}</div>}<div className="payment-summary"><span>{language==='bn'?'পেমেন্ট মাধ্যম':'Payment method'}</span><b>{selectedPaymentMethod}</b><span>{language==='bn'?'সর্বমোট':'Total'}</span><b>৳{Number(paymentAmount||0).toLocaleString(language==='bn'?'bn-BD':'en-BD')}</b></div><button className="primary full" onClick={submitManualPayment}>{language==='bn'?'যাচাইয়ের জন্য জমা দিন':'Submit for verification'} →</button><small>{language==='bn'?'Admin যাচাই না করা পর্যন্ত balance যোগ হবে না।':'Balance will not be added until admin verification.'}</small></div></div>}
    {toast && <div className="toast">✓ {toast}</div>}
  </div>
}

function PlanCard({plan,onClick}:{plan:typeof plans[number],onClick:()=>void}) { return <article className="plan-card"><div className="plan-icon" style={{background:`${plan.color}16`}} aria-hidden="true">{plan.icon}</div><span className="risk">{plan.risk}</span><h3>{plan.name}</h3><p>মূল্য ও রিটার্ন সূচক</p><strong style={{color:plan.color}}>{plan.returnRate}</strong><footer><span>সর্বনিম্ন {plan.minimum}</span><button onClick={onClick}>প্ল্যান দেখুন →</button></footer></article> }

function OpportunitySection({notify}:{notify:(message:string)=>void}) { return <section className="section opportunity-section invest-opportunities"><div className="section-heading"><div><span>আপনার অভিজ্ঞ ব্যবসার নেটওয়ার্ক</span><h2>গোল্ড-ব্যাকড SME সুযোগ</h2></div><div className="verified-head">✓ ব্যবসা যাচাই সম্পন্ন</div></div><div className="opportunity-grid">{opportunities.map(item => <article className="opportunity" key={item.title}><div className="op-img" style={{background:item.tint}}><span>{item.tag}</span><b className="gold-symbol">GOLD BAR</b></div><div className="op-body"><small>✓ ব্যবসা ও স্বর্ণ যাচাইকৃত</small><h3>{item.title}</h3><p>{item.desc}</p><div className="progress"><i style={{width:`${item.raised}%`}}/></div><div className="fund-row"><span>{item.raised}% সংগ্রহ</span><b>{item.amount}</b></div><button className="op-button" onClick={()=>notify(`${item.title} বিস্তারিত`)}>বিস্তারিত ও ঝুঁকি দেখুন →</button></div></article>)}</div></section> }

function TrustCompliance({language}:{language:'bn'|'en'}) {
  const bn = language === 'bn'
  const items = bn ? [
    ['LIVE','লাইভ মূল্যসূত্র','GoldR-এ প্রকাশিত BAJUS বাজারমূল্যের রেফারেন্স'],
    ['22K','স্বর্ণ যাচাইকরণ','ক্রয়ের আগে ক্যারেট, ওজন ও হলমার্ক নথি'],
    ['KYC','পরিচয় যাচাই','লেনদেনের আগে KYC ও প্রয়োজনীয় AML পরীক্ষা'],
    ['PAY','নিরাপদ পেমেন্ট','শুধু অনুমোদিত ব্যাংক বা payment gateway ব্যবহারের নীতি'],
    ['FEE','স্বচ্ছ হিসাব','নিশ্চিত করার আগে মূল্য, fee ও spread দেখানো হবে'],
    ['RISK','ঝুঁকি প্রকাশ','বাজারদর পরিবর্তনশীল—কোনো নিশ্চিত লাভের প্রতিশ্রুতি নেই'],
  ] : [
    ['LIVE','Live price source','BAJUS market-rate reference published by GoldR'],
    ['22K','Gold verification','Karat, weight and hallmark records before purchase'],
    ['KYC','Identity checks','KYC and required AML checks before transactions'],
    ['PAY','Secure payments','Policy to use approved banks or payment gateways only'],
    ['FEE','Transparent pricing','Price, fees and spread shown before confirmation'],
    ['RISK','Risk disclosure','Gold prices fluctuate—returns are never guaranteed'],
  ]
  return <section className="trust-compliance" aria-labelledby="trust-title"><div className="trust-heading"><span>{bn?'নিরাপত্তা • স্বচ্ছতা • জবাবদিহি':'SECURITY • TRANSPARENCY • ACCOUNTABILITY'}</span><h2 id="trust-title">{bn?'ট্রাস্ট ও কমপ্লায়েন্স সেন্টার':'Trust & Compliance Center'}</h2><p>{bn?'প্রতিটি বিনিয়োগ সিদ্ধান্তের আগে প্রয়োজনীয় তথ্য পরিষ্কারভাবে জানানো আমাদের নীতি।':'Our policy is to present the essential facts clearly before every investment decision.'}</p></div><div className="compliance-grid">{items.map(([code,title,desc])=><article key={code}><i>{code}</i><div><h3>{title}</h3><p>{desc}</p></div><b aria-label={bn?'তথ্য প্রকাশিত':'Information disclosed'}>✓</b></article>)}</div><div className="compliance-note"><strong>{bn?'গুরুত্বপূর্ণ নিয়ন্ত্রক নোটিশ':'Important regulatory notice'}</strong><p>{bn?'প্রয়োজনীয় লাইসেন্স, অনুমোদন এবং তৃতীয়-পক্ষ চুক্তি কার্যকর হওয়ার আগে কোনো বাস্তব বিনিয়োগ বা গ্রাহকের অর্থ গ্রহণ করা হবে না।':'No live investment or customer funds will be accepted before required licences, approvals and third-party agreements are active.'}</p></div></section>
}

function LegalSupport({language}:{language:'bn'|'en'}) {
  const bn = language === 'bn'
  return <section className="legal-support"><div className="support-panel"><span className="section-kicker">{bn?'সহায়তা ও প্রতিষ্ঠান পরিচিতি':'SUPPORT & COMPANY INFORMATION'}</span><h2>{bn?'সরাসরি যোগাযোগ ও সুরক্ষা তথ্য':'Direct support & protection details'}</h2><div className="support-grid"><article><i>24/7</i><h3>{bn?'কাস্টমার সাপোর্ট':'Customer support'}</h3><p>{bn?'অ্যাকাউন্ট, পেমেন্ট ও বিনিয়োগ সংক্রান্ত সহায়তা।':'Help with accounts, payments and investments.'}</p><a href="mailto:support@goldinvestor.com">support@goldinvestor.com</a><small>{bn?'ফোন ও লাইভ চ্যাট নম্বর যাচাই শেষে যুক্ত হবে':'Verified phone and live-chat details will be added'}</small></article><article><i>HQ</i><h3>{bn?'অফিসের ঠিকানা':'Physical address'}</h3><p>{bn?'নিবন্ধিত অফিসের ঠিকানা যাচাই শেষে এখানে প্রকাশ করা হবে।':'The verified registered-office address will be published here.'}</p><span className="pending-badge">{bn?'যাচাইকরণ চলমান':'Verification pending'}</span><small>{bn?'ভিজিটের আগে appointment প্রয়োজন হবে':'An appointment will be required before visiting'}</small></article><article><i>VAULT</i><h3>{bn?'ভল্ট ও ইনস্যুরেন্স':'Vault & insurance'}</h3><p>{bn?'Custodian, vault location, insurer এবং policy reference চুক্তি সম্পন্ন হলে প্রকাশ করা হবে।':'Custodian, vault location, insurer and policy reference will be disclosed after contracts are active.'}</p><span className="pending-badge">{bn?'পার্টনার তথ্য অপেক্ষমাণ':'Partner details pending'}</span><small>{bn?'প্রমাণ ছাড়া insured দাবি করা হয় না':'No insured claim is made without evidence'}</small></article></div></div><div className="legal-pages"><div className="legal-head"><span>{bn?'আইনি নথি':'LEGAL DOCUMENTS'}</span><h2>{bn?'নীতি ও গুরুত্বপূর্ণ তথ্য':'Policies & important information'}</h2></div><details><summary>{bn?'ব্যবহারের শর্তাবলি':'Terms of use'}<b>＋</b></summary><p>{bn?'সেবা ব্যবহার, অ্যাকাউন্টের দায়িত্ব, গ্রহণযোগ্য ব্যবহার এবং প্রযোজ্য সীমাবদ্ধতা এখানে বর্ণিত। বাস্তব সেবা চালুর আগে আইনজীবীর অনুমোদিত পূর্ণ নথি প্রকাশ করতে হবে।':'Covers service use, account responsibilities, acceptable use and applicable limitations. A lawyer-approved full version must be published before launch.'}</p></details><details><summary>{bn?'গোপনীয়তা নীতি':'Privacy policy'}<b>＋</b></summary><p>{bn?'নাম, ফোন, KYC ও transaction data কেন নেওয়া হয়, কতদিন রাখা হয় এবং কার সঙ্গে শেয়ার করা হয়—তা স্পষ্টভাবে জানাতে হবে।':'Must explain why name, phone, KYC and transaction data are collected, retention periods and permitted sharing.'}</p></details><details><summary>{bn?'ঝুঁকি প্রকাশ':'Risk disclosure'}<b>＋</b></summary><p>{bn?'স্বর্ণের মূল্য বাড়তে বা কমতে পারে। SME বিনিয়োগে মূলধনের ক্ষতি হতে পারে এবং কোনো রিটার্ন নিশ্চিত নয়।':'Gold prices may rise or fall. SME investments can lose capital and no return is guaranteed.'}</p></details><details><summary>{bn?'রিফান্ড ও বাতিল নীতি':'Refund & cancellation policy'}<b>＋</b></summary><p>{bn?'Order confirmation, cooling-off period, refund eligibility, processing time এবং applicable charge চালুর আগে নির্দিষ্ট করতে হবে।':'Order confirmation, cooling-off period, refund eligibility, processing times and applicable charges must be defined before launch.'}</p></details></div></section>
}

function PaymentSection({compact=false,onSelect}:{compact?:boolean,onSelect:(name:string)=>void}) {
  const [method,setMethod] = useState('')
  const choose = (name:string) => { setMethod(name); onSelect(name) }
  return <section className={`payment-section ${compact?'compact':''}`} id="payment-options">
    <div className="payment-title"><span>▣ নিরাপদ ও সহজ পেমেন্ট</span><h2>পেমেন্ট পার্টনার</h2><p>বাংলাদেশের জনপ্রিয় মোবাইল ফাইন্যান্সিয়াল সার্ভিস, ব্যাংক ও কার্ড সাপোর্ট।</p></div>
    <div className="payment-group"><h3>📱 মোবাইল ওয়ালেট</h3><div className="payment-grid mobile-grid">{mobilePayments.map(item=><button key={item.name} className={method===item.name?'selected':''} onClick={()=>choose(item.name)}><Logo item={item}/><span>{item.name}</span><b>✓</b></button>)}</div></div>
    {!compact && <div className="payment-group"><h3>🏦 ইন্টারনেট ব্যাংকিং</h3><div className="payment-grid bank-grid">{banks.map(item=><button key={item.name} className={method===item.name?'selected':''} onClick={()=>choose(item.name)}><Logo item={item}/><span>{item.name}</span><b>✓</b></button>)}</div></div>}
    <div className="card-strip"><div><span className="card-icons" aria-label="Supported cards"><i className="visa-badge">VISA</i><i className="mastercard-badge" aria-label="Mastercard"><b/><b/></i><i className="amex-badge">AMEX</i><i className="nexus-badge">NEXUS</i></span><strong>ডেবিট ও ক্রেডিট কার্ড</strong><small>Visa, Mastercard, Amex ও Nexus</small></div><button onClick={()=>choose('কার্ড')}>কার্ড ব্যবহার করুন →</button></div>
    <div className="payment-security"><span><i>✓</i> ২৫৬-বিট সুরক্ষা</span><span><i>◇</i> PCI DSS মানসম্মত</span><span><i>↯</i> দ্রুত ও নিরাপদ</span></div>
  </section>
}
function termsMarkup(bn:boolean) { return bn ? `<div class="terms-intro"><b>সর্বশেষ হালনাগাদ: ১০ আগস্ট ২০২৬</b><p>এই শর্তাবলি bKash Investor ডেমো প্ল্যাটফর্ম ব্যবহার নিয়ন্ত্রণ করে। অ্যাকাউন্ট তৈরি বা সেবা ব্যবহার করলে আপনি এগুলো মেনে নিচ্ছেন।</p></div><h3>১. প্ল্যাটফর্মের অবস্থা</h3><p>এটি বর্তমানে একটি ডেমো প্রোটোটাইপ—লাইসেন্সপ্রাপ্ত বিনিয়োগ মধ্যস্থতাকারী, ব্যাংক, MFS বা payment gateway নয়। এখানে প্রদর্শিত কোনো কার্যক্রম বাস্তব অর্থ লেনদেন বা সিকিউরিটিজ অফার নয়।</p><h3>২. যোগ্যতা ও পরিচয় যাচাই</h3><p>বাস্তব সেবা চালু হলে ব্যবহারকারীর বয়স কমপক্ষে ১৮ বছর, বৈধ বাংলাদেশি পরিচয়পত্র ও নিজের নামে নিবন্ধিত মোবাইল নম্বর থাকতে হবে। প্রযোজ্য e-KYC, AML ও CFT যাচাই সম্পন্ন না হলে লেনদেন সীমিত বা বন্ধ থাকবে।</p><h3>৩. বিনিয়োগের ঝুঁকি</h3><p>SME ও পুঁজিবাজারভিত্তিক বিনিয়োগে মূলধনের আংশিক বা সম্পূর্ণ ক্ষতি হতে পারে। পূর্বের ফলাফল ভবিষ্যৎ রিটার্ন নিশ্চিত করে না। সিদ্ধান্তের আগে প্রকল্প, মেয়াদ, ঝুঁকি ও আর্থিক সামর্থ্য বুঝে নিন।</p><h3>৪. রিটার্ন ও হিসাব</h3><p>প্রদর্শিত রিটার্ন, আয়, চার্ট ও হিসাব কেবল উদাহরণ এবং আনুমানিক। কর, ফি, প্রকল্পের ফলাফল ও বাজার পরিস্থিতির কারণে প্রকৃত ফল ভিন্ন হতে পারে। কোনো স্থির বা নিশ্চিত লাভের প্রতিশ্রুতি দেওয়া হয় না।</p><h3>৫. পেমেন্ট ও টাকা উত্তোলন</h3><p>বাস্তব লেনদেন শুধু অনুমোদিত ব্যাংক, MFS, PSP/PSO বা payment gateway-এর মাধ্যমে হবে। তৃতীয় পক্ষের processing time, সীমা ও চার্জ প্রযোজ্য হতে পারে। অন্যের অ্যাকাউন্ট বা সন্দেহজনক উৎসের অর্থ গ্রহণযোগ্য নয়।</p><h3>৬. অ্যাকাউন্ট নিরাপত্তা</h3><p>PIN, OTP ও login তথ্য গোপন রাখা ব্যবহারকারীর দায়িত্ব। আমরা কখনো ফোন, ইমেইল বা বার্তায় PIN/OTP চাইব না। অননুমোদিত ব্যবহার সন্দেহ হলে দ্রুত PIN বদলে support-এ জানান।</p><h3>৭. নিষিদ্ধ ব্যবহার</h3><p>ভুয়া পরিচয়, প্রতারণা, money laundering, সন্ত্রাসে অর্থায়ন, অননুমোদিত automation, সিস্টেমে আক্রমণ বা আইনবিরোধী লেনদেন নিষিদ্ধ। প্রয়োজনে অ্যাকাউন্ট স্থগিত এবং সংশ্লিষ্ট কর্তৃপক্ষকে রিপোর্ট করা হতে পারে।</p><h3>৮. গোপনীয়তা ও তথ্য</h3><p>ডেমোতে নাম ও নম্বর কেবল আপনার browser storage-এ থাকে। Production সংস্করণে পরিচয়, যোগাযোগ, KYC ও transaction data প্রযোজ্য privacy notice এবং আইনি বাধ্যবাধকতা অনুযায়ী প্রক্রিয়াকরণ করা হবে।</p><h3>৯. ফি, কর ও চার্জ</h3><p>প্রযোজ্য service fee, gateway charge ও সরকারি কর লেনদেন নিশ্চিত করার আগে দেখানো হবে। ব্যবহারকারী নিজের করসংক্রান্ত দায়ের জন্য দায়িত্বশীল।</p><h3>১০. অভিযোগ ও সহায়তা</h3><p>প্রথমে Help Center-এ যোগাযোগ করুন। নিয়ন্ত্রিত ব্যাংক/MFS সেবার unresolved অভিযোগ প্রযোজ্য প্রতিষ্ঠানের অভিযোগ প্রক্রিয়া এবং বাংলাদেশ ব্যাংকের গ্রাহক স্বার্থ সংরক্ষণ ব্যবস্থায় তোলা যেতে পারে।</p><h3>১১. সেবা পরিবর্তন ও দায়সীমা</h3><p>নিরাপত্তা, আইন বা রক্ষণাবেক্ষণের প্রয়োজনে সেবা পরিবর্তন বা সাময়িকভাবে বন্ধ হতে পারে। তৃতীয় পক্ষের network, bank বা gateway failure-এর জন্য platform-এর দায় প্রযোজ্য আইনের সীমার মধ্যে থাকবে।</p><h3>১২. নিয়ন্ত্রক ও আইনি নোটিশ</h3><p>বাস্তব বিনিয়োগ চালুর আগে প্রয়োজনীয় BSEC, বাংলাদেশ ব্যাংক ও অন্যান্য কর্তৃপক্ষের অনুমোদন/লাইসেন্স যাচাই আবশ্যক। পুঁজিবাজার ঝুঁকিপূর্ণ—জেনে ও বুঝে বিনিয়োগ করুন। এই খসড়া আইনি পরামর্শ নয়।</p>` : `<div class="terms-intro"><b>Last updated: August 10, 2026</b><p>These terms govern use of the bKash Investor demo. By creating an account or using the service, you agree to them.</p></div><h3>1. Platform status</h3><p>This is currently a demo prototype—not a licensed investment intermediary, bank, MFS provider, or payment gateway. No feature shown here constitutes a real-money transaction or securities offer.</p><h3>2. Eligibility and verification</h3><p>A live service would require users to be at least 18, hold valid Bangladeshi identification, and use a mobile number registered in their name. Transactions would remain restricted until applicable e-KYC, AML, and CFT checks are complete.</p><h3>3. Investment risk</h3><p>SME and capital-market investments may result in partial or total loss of capital. Past performance does not guarantee future returns. Review each project, term, risk, and your financial capacity before investing.</p><h3>4. Returns and estimates</h3><p>Displayed returns, earnings, charts, and calculations are illustrative estimates. Actual outcomes may differ due to taxes, fees, project performance, and market conditions. No fixed or guaranteed profit is promised.</p><h3>5. Payments and withdrawals</h3><p>Live transactions would use only approved banks, MFS providers, PSPs/PSOs, or payment gateways. Third-party processing times, limits, and charges may apply. Funds from another person’s account or suspicious sources are prohibited.</p><h3>6. Account security</h3><p>You are responsible for protecting your PIN, OTP, and login details. We will never request your PIN or OTP by phone, email, or message. Change your PIN and contact support immediately if unauthorized access is suspected.</p><h3>7. Prohibited use</h3><p>False identity, fraud, money laundering, terrorist financing, unauthorized automation, attacks on the service, and unlawful transactions are prohibited. Accounts may be suspended and activity reported where required.</p><h3>8. Privacy and data</h3><p>In this demo, name and mobile number remain in your browser storage. A production service would process identity, contact, KYC, and transaction data under a dedicated privacy notice and applicable legal obligations.</p><h3>9. Fees and tax</h3><p>Applicable service fees, gateway charges, and government taxes would be shown before confirmation. Users remain responsible for their own tax obligations.</p><h3>10. Complaints and support</h3><p>Contact the Help Center first. Unresolved complaints involving a regulated bank or MFS service may be escalated through that provider’s process and the applicable Bangladesh Bank customer-protection channel.</p><h3>11. Service changes and liability</h3><p>The service may change or pause for security, legal, or maintenance reasons. Liability for third-party network, bank, or gateway failures is limited to the extent permitted by applicable law.</p><h3>12. Regulatory and legal notice</h3><p>Required approvals or licences from BSEC, Bangladesh Bank, and other authorities must be confirmed before any live investment service launches. Capital-market investment is risky—invest only after understanding the risks. This draft is not legal advice.</p>` }

function ProfilePage({language,loggedIn,onRegister,onLogin,onLogout}:{language:'bn'|'en';loggedIn:boolean;onRegister:()=>void;onLogin:()=>void;onLogout:()=>void}) {
  const bn = language === 'bn'
  void onLogin; void onLogout
  const [view,setView] = useState<'personal'|'security'|'help'|'terms'|null>(null)
  const [user,setUser] = useState<{name:string;phone:string}|null>(()=>{try{return JSON.parse(localStorage.getItem('bkash-investor-user')||'null')}catch{return null}})
  useEffect(()=>{ if(!loggedIn)setUser(null); else try{setUser(JSON.parse(localStorage.getItem('bkash-investor-user')||'null'))}catch{setUser(null)} },[loggedIn])
  useEffect(()=>{ if(view==='terms') window.setTimeout(()=>{const el=document.querySelector('.terms-copy');if(el)el.innerHTML=termsMarkup(bn).replaceAll('bKash Investor','Gold Investor')},0) },[view,bn])
  const [name,setName] = useState(user?.name||''), [phone,setPhone] = useState(user?.phone||''), [message,setMessage] = useState('')
  const saveProfile = () => { if(name.trim().length<2||!/^01[3-9]\d{8}$/.test(phone)) return setMessage(bn?'সঠিক নাম ও মোবাইল নম্বর দিন':'Enter a valid name and mobile number'); const next={name:name.trim(),phone}; localStorage.setItem('bkash-investor-user',JSON.stringify(next)); setUser(next); setMessage(bn?'তথ্য সংরক্ষণ হয়েছে':'Profile saved') }
  const initials = user?.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() || 'BI'
  return <section className="dashboard-page profile-page"><div className={`profile-card ${user?'member-card':''}`}>{user&&<span className="member-label">GOLD MEMBER</span>}<div className="avatar">{initials}</div><div className="profile-identity"><h1>{user?user.name:(bn?'আপনার প্রোফাইল':'Your profile')}</h1><p>{user?user.phone:(bn?'বিনিয়োগ শুরু করতে অ্যাকাউন্ট তৈরি করুন':'Create an account to start investing')}</p>{!user&&<button className="primary" onClick={onRegister}>{bn?'রেজিস্ট্রেশন করুন':'Register'}</button>}{user&&<span className="verified-pill">✓ {bn?'ভেরিফাইড অ্যাকাউন্ট':'Verified account'}</span>}</div>{user&&<div className="profile-stats"><div><b>২২K</b><span>{bn?'গোল্ড স্ট্যান্ডার্ড':'Gold standard'}</span></div><div><b>৳৫,০০০</b><span>{bn?'শুরু করার পরিমাণ':'Starting amount'}</span></div><div><b>২৪/৭</b><span>{bn?'পোর্টফোলিও অ্যাক্সেস':'Portfolio access'}</span></div></div>}</div><div className="profile-menu-wrap"><div className="profile-menu-title"><span>{bn?'অ্যাকাউন্ট সেটিংস':'Account settings'}</span><small>{bn?'তথ্য, নিরাপত্তা ও সহায়তা পরিচালনা করুন':'Manage information, security and support'}</small></div><div className="menu-list"><button onClick={()=>setView('personal')}><i>01</i><b>{bn?'ব্যক্তিগত তথ্য':'Personal information'}</b><span>›</span></button><button onClick={()=>setView('security')}><i>02</i><b>{bn?'নিরাপত্তা':'Security'}</b><span>›</span></button><button onClick={()=>setView('help')}><i>03</i><b>{bn?'সহায়তা কেন্দ্র':'Help center'}</b><span>›</span></button><button onClick={()=>setView('terms')}><i>04</i><b>{bn?'শর্তাবলি':'Terms & conditions'}</b><span>›</span></button></div></div>{view&&<div className="modal-backdrop" onMouseDown={e=>e.currentTarget===e.target&&setView(null)}><div className="modal profile-modal"><button className="close" onClick={()=>setView(null)}>×</button>{view==='personal'&&<><h2>{bn?'ব্যক্তিগত তথ্য':'Personal information'}</h2>{user?<><label>{bn?'নাম':'Full name'}<input value={name} onChange={e=>setName(e.target.value)}/></label><label>{bn?'মোবাইল নম্বর':'Mobile number'}<input value={phone} inputMode="numeric" onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))}/></label><button className="primary full" onClick={saveProfile}>{bn?'সংরক্ষণ করুন':'Save changes'}</button></>:<><p>{bn?'তথ্য দেখতে আগে অ্যাকাউন্ট তৈরি করুন।':'Create an account to view your details.'}</p><button className="primary full" onClick={()=>{setView(null);onRegister()}}>{bn?'অ্যাকাউন্ট খুলুন':'Create account'}</button></>}{message&&<div className="form-success">{message}</div>}</>}{view==='security'&&<SecurityPanel bn={bn}/>} {view==='help'&&<><h2>{bn?'সহায়তা কেন্দ্র':'Help center'}</h2><div className="info-list"><p><b>☎ ১৬২৪৭</b><span>{bn?'প্রতিদিন সকাল ৮টা–রাত ১০টা':'Daily, 8 AM–10 PM'}</span></p><p><b>✉ support@goldinvestor.com</b><span>{bn?'২৪ ঘণ্টার মধ্যে উত্তর':'Response within 24 hours'}</span></p><p><b>{bn?'সাধারণ প্রশ্ন':'Frequently asked questions'}</b><span>{bn?'বিনিয়োগ, পেমেন্ট ও রিটার্ন সহায়তা':'Investment, payment and return support'}</span></p></div></>}{view==='terms'&&<><h2>{bn?'শর্তাবলি':'Terms & conditions'}</h2><div className="terms-copy"><p>{bn?'১. এটি বর্তমানে একটি ডেমো বিনিয়োগ প্ল্যাটফর্ম।':'1. This is currently a demo investment platform.'}</p><p>{bn?'২. প্রদর্শিত রিটার্ন আনুমানিক; নিশ্চিত নয়।':'2. Displayed returns are estimates and are not guaranteed.'}</p><p>{bn?'৩. বাস্তব বিনিয়োগের আগে পরিচয় যাচাই ও ঝুঁকি মূল্যায়ন প্রয়োজন।':'3. Identity verification and risk assessment are required before real investment.'}</p><p>{bn?'৪. অনুমোদিত payment gateway ছাড়া কোনো অর্থ গ্রহণ করা হয় না।':'4. No funds are accepted without an approved payment gateway.'}</p></div></>}</div></div>}</section>
}

function SecurityPanel({bn}:{bn:boolean}) { const [pin,setPin]=useState(''),[confirm,setConfirm]=useState(''),[msg,setMsg]=useState(''); const save=()=>{if(!/^\d{5}$/.test(pin))return setMsg(bn?'PIN অবশ্যই ৫ সংখ্যার হতে হবে':'PIN must contain 5 digits');if(pin!==confirm)return setMsg(bn?'দুটি PIN মিলছে না':'PINs do not match');setMsg(bn?'PIN সফলভাবে পরিবর্তন হয়েছে':'PIN changed successfully');setPin('');setConfirm('')}; return <><h2>{bn?'নিরাপত্তা':'Security'}</h2><p>{bn?'নতুন ৫ সংখ্যার PIN সেট করুন।':'Set a new 5-digit PIN.'}</p><label>{bn?'নতুন PIN':'New PIN'}<input type="password" inputMode="numeric" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,5))}/></label><label>{bn?'PIN নিশ্চিত করুন':'Confirm PIN'}<input type="password" inputMode="numeric" value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,'').slice(0,5))}/></label><button className="primary full" onClick={save}>{bn?'PIN পরিবর্তন করুন':'Change PIN'}</button>{msg&&<div className="form-success">{msg}</div>}</> }

function LoginForm({language,onClose,onSuccess,onRegister}:{language:'bn'|'en';onClose:()=>void;onSuccess:(name:string)=>void;onRegister:()=>void}) { const bn=language==='bn',[phone,setPhone]=useState(''),[pin,setPin]=useState(''),[error,setError]=useState(''); const submit=(e:React.FormEvent)=>{e.preventDefault();try{const account=JSON.parse(localStorage.getItem('bkash-investor-account')||'null');if(!account)return setError(bn?'এই নম্বরে কোনো অ্যাকাউন্ট নেই':'No account found for this number');if(account.phone!==phone||account.pin!==pin)return setError(bn?'মোবাইল নম্বর অথবা PIN ভুল':'Incorrect mobile number or PIN');onSuccess(account.name)}catch{setError(bn?'লগইন করা যায়নি':'Unable to log in')}}; return <div className="modal-backdrop" onMouseDown={e=>e.currentTarget===e.target&&onClose()}><form className="modal login-form" onSubmit={submit}><button type="button" className="close" onClick={onClose}>×</button><h2>{bn?'লগইন করুন':'Log in'}</h2><p>{bn?'আপনার অ্যাকাউন্টে প্রবেশ করুন':'Access your bKash Investor account'}</p><label>{bn?'মোবাইল নম্বর':'Mobile number'}<input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))} inputMode="numeric" placeholder="01XXXXXXXXX" autoComplete="tel"/></label><label>{bn?'৫ সংখ্যার PIN':'5-digit PIN'}<input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,5))} type="password" inputMode="numeric" placeholder="•••••" autoComplete="current-password"/></label>{error&&<div className="form-error">⚠ {error}</div>}<button className="primary full" type="submit">{bn?'লগইন':'Log in'}</button><button className="text-button" type="button" onClick={onRegister}>{bn?'অ্যাকাউন্ট নেই? তৈরি করুন':'No account? Create one'}</button></form></div> }

function RegisterForm({language,onClose,onSuccess}:{language:'bn'|'en';onClose:()=>void;onSuccess:(name:string)=>void}) {
  const [name,setName] = useState(''), [phone,setPhone] = useState(''), [pin,setPin] = useState(''), [confirmPin,setConfirmPin] = useState(''), [error,setError] = useState('')
  const bn = language === 'bn'
  const submit = (e:React.FormEvent) => { e.preventDefault(); setError(''); if(name.trim().length<2)return setError(bn?'সঠিক নাম লিখুন':'Enter your full name'); if(!/^01[3-9]\d{8}$/.test(phone))return setError(bn?'সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন':'Enter a valid 11-digit mobile number'); if(!/^\d{5}$/.test(pin))return setError(bn?'PIN অবশ্যই ৫ সংখ্যার হতে হবে':'PIN must contain exactly 5 digits'); if(pin!==confirmPin)return setError(bn?'দুটি PIN মিলছে না':'PINs do not match'); const account={name:name.trim(),phone,pin}; localStorage.setItem('bkash-investor-account',JSON.stringify(account)); localStorage.setItem('bkash-investor-user',JSON.stringify({name:account.name,phone})); onSuccess(name.trim()) }
  return <div className="modal-backdrop" onMouseDown={e=>e.currentTarget===e.target&&onClose()}><form className="modal register-form" role="dialog" aria-modal="true" onSubmit={submit}><button type="button" className="close" onClick={onClose}>×</button><h2>{bn?'অ্যাকাউন্ট খুলুন':'Create account'}</h2><p>{bn?'আপনার তথ্য দিয়ে নিরাপদে শুরু করুন':'Start securely with your information'}</p><label>{bn?'নাম':'Full name'}<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder={bn?'আপনার পুরো নাম':'Your full name'}/></label><label>{bn?'মোবাইল নম্বর':'Mobile number'}<input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))} inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX"/></label><label>{bn?'৫ সংখ্যার PIN তৈরি করুন':'Create a 5-digit PIN'}<input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,5))} type="password" inputMode="numeric" autoComplete="new-password" placeholder="•••••"/></label><label>{bn?'PIN আবার লিখুন':'Confirm PIN'}<input value={confirmPin} onChange={e=>setConfirmPin(e.target.value.replace(/\D/g,'').slice(0,5))} type="password" inputMode="numeric" autoComplete="new-password" placeholder="•••••"/></label>{error&&<div className="form-error" role="alert">⚠ {error}</div>}<button className="primary full" type="submit">{bn?'অ্যাকাউন্ট তৈরি করুন':'Create account'}</button><small>{bn?'আপনার PIN নিরাপদে গোপন রাখা হবে।':'Your PIN will be kept private and secure.'}</small></form></div>
}

function Logo({item}:{item:{short:string;color:string;domain:string;name:string;logo?:string}}) {
  const [failed,setFailed] = useState(false)
  const unavailable = ['Dutch-Bangla Bank','Islami Bank','Prime Bank','Janata Bank'].includes(item.name)
  const showBadge = failed || unavailable
  return <i className={`real-logo ${showBadge?'bank-letter-logo':''} ${item.logo?'featured-logo':''} ${item.name==='Rocket'?'rocket-logo':''} ${item.name==='bKash'||item.name==='Nagad'?'main-wallet-logo':''}`} style={{background:showBadge?item.color:'#fff'}}>{!showBadge&&<img src={item.logo || `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`} alt={`${item.name} logo`} onError={()=>setFailed(true)}/>} {showBadge&&<span>{item.short}</span>}</i>
}
export default App
