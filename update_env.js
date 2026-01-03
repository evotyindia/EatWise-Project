const fs = require('fs');

const envPath = '.env';
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYsQXo5c2lneia
lV6+SUksSjX48AnUIbzyU1bxvIo/NGuRAtzTzGmZ+zefvgc9lNY94cCEUMzDPt2J
EnqPEtA/LE6OllOkNf9sw1lZT8vfDSl6e0fmLEYkAQg1iA6VRVbeQn6OIe0oFeNZ
th0Dn5SYliohc9YAkfo26Va84pk3LUN5NWoWBWyFDNRZIeBNeq8BsnuyxYEp7MRP
3dpqiGaDBN+4eGjRcX0iB1kKPGALs3CfDoHohKQLXGvD8Pxc3lAdfCQflbVgZ4FT
AaZOVorj4admQWXPetjnKCvHyhX8JaRr4ncxVG5GLJiHma2AdcNfKLVO646/I86A
4aQG/NBJAgMBAAECggEACrg62vvvMRZh8yBTc3Z/rZ1UJrLrbbokorqZGwWKix9q
Adc6m5/5Nfc+E3fq2Dbvx45mzqNBjN+H/AyRECRY/GZm6XnCS4AC+6bHSg7hGDq7
U7798DnhfruX0PJJW89vZtEyQ1Y8aRkISg8QAGYer4uzT3/rYUTeVSaSkVYzPX1T
PsnKUXxMljOywgGrvcZ4axIcIpcUjgeG2yfcakfJuxSotEA6/HBkwT4cmCoONmE3
KrJceDTqXEPJIIEKRV7+VtQyB0GRSL//fSQyMsbq89hO0zT37QzXVl+9tuMWbAv4
12110yYq3mw+fvXeqFBh7objvI1VNkYBPTuTfrWCAQKBgQDLX/SY95ifqHbGktM8
9Jf3nkzLj4HrLsJc21FdfGnjphDlbrIA9jyz+w49p1DGbIjHO9Gya5PKyBsHpUMZ
ZD/DYV4yqeS97JPTbCCCFrPMCZZSm5ELyeGZ/TfY584tyLL6XXQ1LaOFCMfw2Vr4
C8i5RT7LZrzk72B6k8BgAGCCQQKBgQDAM64kyULmNKYGVdWwyYuEgM0qyQD6BBBC
eOeJ/2l1LtVjOvp4u83XP9oDY+K7e3pAkQ47AjunLTa99mLzsioOOBvkeHCsGR4r
B1XMwKu3929ng4llbVMeIT2aVmWpYDdbsWI5vuucQboRKbCgFGqXbpudCx7Rq/lv
5mhjjtE8CQKBgFG2sDR15yDfMzn97FnlfNnFBN4VPwIbu4RLqpmBT5pkMw28OFEi
nqlCCirDezT+jsZeRpcFmlAzroiX4inlmakLCioZEQsubwbXvwgFzyAACiIO12yB
JOAWWcYQ/UpwBVmLCxIC0Fy3dn5TFrXrJi8qn1xiXyss8vrNOtJX1G8BAoGAZous
P+g5j0VLx1mId5gwnfNyg39WzA3a9vw23MOu6lygcR8If94DhvKESQbD869/nG9I
HmekmB9hc5y/UrIeChQZnZ48zzVfiSmSt3mcpLyZbasaZUkc7Zhim7O47dNt9bgA
ZjrczjOrKHkLyXzbGgxjbjh+qvOMVA2kaGnMbLECgYANuY/6Z56trWvRtFu544FP
i3cXtkMbdIWK2GqoeKsCS8CFPO9kOwWca2IzbL8p3c9ChOXw668iCrt+voM9CxHJ
Uu/44uLjpOL20Bqs2dDO7oXeMOA7jsdlkGuSzi3/Uy/X+uS2zs/+9r+v9edpUbex
PKlhJu1nRPTA9g/Z7VCmsQ==
-----END PRIVATE KEY-----`;

// properly escape newlines for the .env value which will be read by process.env
const privateKeyOnOneLine = privateKey.replace(/\n/g, '\\n');

const newContent = `
FIREBASE_PROJECT_ID="swasth-bharat-advisor"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@swasth-bharat-advisor.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="${privateKeyOnOneLine}"
`;

try {
    fs.appendFileSync(envPath, newContent, 'utf8');
    console.log("Successfully appended to .env");

    // Verify
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('swasth-bharat-advisor')) {
        console.log("Verification: Content found in file.");
    } else {
        console.error("Verification Failed: Content not found.");
    }
} catch (error) {
    console.error("Error appending to .env:", error);
}
