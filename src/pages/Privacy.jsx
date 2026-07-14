import { motion } from "framer-motion";
import { Shield, FileText } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen pb-32">
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          <Shield className="w-7 h-7 text-primary" /> Terms &amp; Privacy
        </motion.h1>
      </div>

      <div className="px-6 md:px-12 max-w-xl space-y-8 text-muted-foreground text-sm leading-relaxed">
        {/* Terms & Conditions */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-foreground text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" /> Terms &amp; Conditions
          </h2>

          <p>
            Welcome to the Ringwood Carnival CIO's App. If you continue to browse and use this app, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Ringwood Carnival's relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.
          </p>

          <p>
            The term 'Ringwood Carnival' or 'Ringwood Carnival CIO' or 'us' or 'we' refers to the owner of the website whose registered office is: Ringwood Carnival CIO, C/O 6 Ashburn Garth, Ringwood, BH24 3DF. Our charity registration number is 1207443. The term 'you' refers to the user or viewer of our website.
          </p>

          <p>The use of this website is subject to the following terms of use:</p>

          <ul className="list-disc pl-5 space-y-3">
            <li>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</li>
            <li>This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: [insert list of information].</li>
            <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
            <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</li>
            <li>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions. Should you wish to use any of our graphics or design, please contact us in the first instance for express permission.</li>
            <li>All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
            <li>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.</li>
            <li>From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</li>
            <li>Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales.</li>
          </ul>
        </section>

        {/* Privacy Statement */}
        <section className="space-y-4 border-t border-border pt-6">
          <h2 className="font-heading font-bold text-foreground text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> Privacy Statement
          </h2>

          <h3 className="font-heading font-semibold text-foreground text-base">Introduction</h3>
          <p>Ringwood Carnival CIO takes the privacy of its supporters and volunteers very seriously.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We will never pass your details on to third parties without your consent.</li>
            <li>We only hold your 'personal' data when you provide it to us, e.g. when you register to take part in the procession, make a donation, purchase tickets etc.</li>
            <li>By visiting our website or participating in our activities, you agree to your personal information being collected and used in the manner set out in this Privacy Notice as updated from time to time.</li>
          </ul>

          <h3 className="font-heading font-semibold text-foreground text-base">Ringwood Carnival CIO is the Data Controller</h3>
          <p>
            In this policy, the words 'we', 'us' or 'our' refer to Ringwood Carnival CIO.
          </p>
          <p>
            Ringwood Carnival CIO is a registered charitable incorporated organisation in England and Wales No: 1207443. You can contact us at{" "}
            <a href="mailto:info@ringwoodcarnival.org.uk" className="text-primary underline hover:text-primary/80">info@ringwoodcarnival.org.uk</a>
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">We collect the following types of information</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-foreground">Personal Information</strong> such as: name, postal address, telephone number, email address. This is taken from the information you voluntarily submit via contact forms on the website, correspondence, phone calls, donations, sponsorship etc.</li>
            <li><strong className="text-foreground">Non-personal information</strong> such as: which web pages you visit, IP addresses, social media used, etc. This is captured using cookies – see our cookie policy.</li>
          </ul>

          <h3 className="font-heading font-semibold text-foreground text-base">How we use your information</h3>
          <p>We will use your personal information for the legitimate interest of conducting the core activities of the charity, these will include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Administer your request to be in the procession</li>
            <li>Administer your request for a stall on the village green</li>
            <li>Administer your request for VIP tickets to the carnival</li>
            <li>Administer your request to volunteer and support us</li>
            <li>Administer donations</li>
            <li>Administer and manage sponsorship</li>
            <li>Provide you with information and updates on our activities</li>
            <li>To present our website and its contents to you and to allow you to participate in interactive features on our website</li>
            <li>Keep a record of your relationship with us</li>
            <li>In any other way we may describe when you provide the information</li>
            <li>For any other purposes with your consent</li>
          </ul>
          <p>
            We may use third party service providers to help us operate the charity and our website or administer activities on our behalf, such as sending out our newsletter. We may share your information with those third parties for those limited purposes.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">How you are in control</h3>
          <p>
            If you have opted in to our mailing list and wish to unsubscribe from receiving future emails, please see the unsubscribe instructions at the bottom of each email or you may notify us by email of your wish to unsubscribe at{" "}
            <a href="mailto:info@ringwoodcarnival.org.uk" className="text-primary underline hover:text-primary/80">info@ringwoodcarnival.org.uk</a>
          </p>
          <p>
            If for any other reason you have concerns or questions regarding the data we may hold about you then please contact us at{" "}
            <a href="mailto:info@ringwoodcarnival.org.uk" className="text-primary underline hover:text-primary/80">info@ringwoodcarnival.org.uk</a>
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">Where we store your personal data</h3>
          <p>
            The data that we collect from you may be transferred to, and stored at, a destination outside the European Economic Area ("EEA"). By submitting your personal data, you agree to this transfer, storing or processing. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this privacy policy.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">How long we keep your information for</h3>
          <p>
            We will only keep your information for as long as we need it to assist you with your enquiry, process your request, donation or any other services provided by us. There are statutory timescales on how long we should keep your information, for example, financial records must be kept for 7 years. We shall delete your information according to these statutory limits, or according to guidance issued by the Information Commissioner.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">Online Security</h3>
          <p>
            No transmission via the internet is wholly secure, so we urge you to safeguard your data by protecting your computer with anti-virus software and ensuring your data is being transmitted securely. Any information you choose to send to us is carried out at your own risk.
          </p>
          <p>
            Once we have received your information, we will use strict procedures and security features to try to prevent unauthorised access.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">Links to other websites</h3>
          <p>
            Our website may contain information linked to or provided by other companies such as Twitter and Facebook. They are outside of our control and not covered by this Privacy Policy. Please be aware that, should you access other sites using the links provided, the operators of these sites may have a privacy notice which differs from our own.
          </p>
          <p>
            We do not accept any responsibility or liability for such privacy policies. Please check the relevant policies before you submit any personal data to these websites.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">Changes to this policy</h3>
          <p>
            Ringwood Carnival CIO reserves the right to modify its website and/or this Privacy Policy at any time.
          </p>

          <h3 className="font-heading font-semibold text-foreground text-base">Cookie Policy</h3>
          <p>
            Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site. A cookie often contains a unique number which can be used to recognise your device, when a user of this device returns to a website that it has visited before.
          </p>
          <p>
            We use cookies to enhance the online experience of all our visitors. They help us identify which pages and/or products are the most important to our visitors and play a key role in helping us enhance the usability and performance of our site.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4">Last updated May 2019</p>
      </div>
    </div>
  );
}