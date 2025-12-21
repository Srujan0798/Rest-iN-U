'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';

const faqCategories = [
    {
        name: 'Buying',
        faqs: [
            { q: 'How do I start searching for homes?', a: 'Use our search page to filter by location, price, bedrooms, and more. Save your favorite properties and set up alerts for new listings.' },
            { q: 'What is the home buying process?', a: 'The typical process includes: getting pre-approved for a mortgage, searching for homes, making an offer, home inspection, appraisal, and closing.' },
            { q: 'How do I contact an agent?', a: 'You can contact agents directly from property listings or browse our agent directory to find a specialist in your area.' },
            { q: 'What are closing costs?', a: 'Closing costs typically range from 2-5% of the home price and include fees for loan origination, title insurance, appraisal, and more.' },
        ]
    },
    {
        name: 'Selling',
        faqs: [
            { q: 'How do I get a home valuation?', a: 'Use our free home value estimator for an instant estimate, or connect with a local agent for a comprehensive market analysis.' },
            { q: 'How long does it take to sell a home?', a: 'The average time varies by market, but typically homes sell within 30-60 days. Pricing correctly is key to a faster sale.' },
            { q: 'What fees do sellers pay?', a: 'Sellers typically pay agent commissions (usually 5-6% split between agents), closing costs, and any negotiated repairs or credits.' },
            { q: 'Should I stage my home?', a: 'Yes! Staged homes often sell faster and for higher prices. Our agents can provide staging recommendations.' },
        ]
    },
    {
        name: 'Renting',
        faqs: [
            { q: 'What do I need to apply for a rental?', a: 'Typically you\'ll need proof of income, credit check authorization, references, and a photo ID. Requirements vary by landlord.' },
            { q: 'How much should I budget for rent?', a: 'A common rule is to spend no more than 30% of your gross monthly income on rent, though this varies by location.' },
            { q: 'Can I negotiate rent?', a: 'Yes! Especially during slower rental seasons or for longer lease terms. It never hurts to ask.' },
            { q: 'What is a security deposit?', a: 'A refundable deposit (usually 1-2 months rent) held by the landlord to cover potential damages or unpaid rent.' },
        ]
    },
    {
        name: 'Agents',
        faqs: [
            { q: 'How do I become a featured agent?', a: 'Sign up for an agent account and complete your profile. Premium subscriptions offer enhanced visibility and lead generation.' },
            { q: 'How does lead distribution work?', a: 'Leads from inquiries on your listings go directly to you. Premium agents also receive leads from area searches.' },
            { q: 'What analytics are available?', a: 'Our agent dashboard provides views, inquiries, conversion rates, and detailed performance metrics for all your listings.' },
            { q: 'How do I add listings?', a: 'Log in to your agent dashboard and use the "Add Listing" feature. You can import from MLS or enter details manually.' },
        ]
    },
];

export default function FAQPage() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [expanded, setExpanded] = useState<string | false>(false);

    const filteredFaqs = faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(faq =>
            faq.q.toLowerCase().includes(search.toLowerCase()) ||
            faq.a.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.faqs.length > 0);

    const displayCategory = search ? filteredFaqs : [faqCategories[activeTab]];

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <HelpIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>Frequently Asked Questions</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Find answers to common questions about buying, selling, and renting
                    </Typography>
                    <TextField
                        placeholder="Search FAQs..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        }}
                        sx={{ maxWidth: 500 }}
                    />
                </Box>

                {!search && (
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered sx={{ mb: 3 }}>
                        {faqCategories.map((cat, i) => (
                            <Tab key={cat.name} label={cat.name} />
                        ))}
                    </Tabs>
                )}

                {displayCategory.map((category) => (
                    <Box key={category.name} sx={{ mb: 4 }}>
                        {search && <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{category.name}</Typography>}
                        {category.faqs.map((faq, i) => (
                            <Accordion
                                key={i}
                                expanded={expanded === `${category.name}-${i}`}
                                onChange={(e, isExpanded) => setExpanded(isExpanded ? `${category.name}-${i}` : false)}
                                sx={{ mb: 1 }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography fontWeight={500}>{faq.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color="text.secondary">{faq.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ))}

                {search && filteredFaqs.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography color="text.secondary">No FAQs match your search</Typography>
                    </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Still have questions?</Typography>
                    <Typography sx={{ mb: 2, opacity: 0.9 }}>Our support team is here to help</Typography>
                    <Box component="a" href="/contact" sx={{ color: 'white', textDecoration: 'underline' }}>
                        Contact Support →
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
