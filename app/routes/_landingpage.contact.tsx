import Hero from "~/components/landingpage/Hero";
import Card from "~/components/Card";
import Container from "~/components/Container";
import { LinkButton } from "~/components/Button";
import { openGraphTags } from "../utils";
import { MetaFunction } from "@remix-run/node";
import { DiscordIcon } from "../components/Icons";

export const meta: MetaFunction = () => {
  return [
    ...openGraphTags(
      "JetKVM - Contact Us",
      "Next generation KVM over IP",
      "JetKVM - Contact Us",
      "Next generation KVM over IP",
    ),
  ];
};

export default function ContactUsRoute() {
  return (
    <div className="mb-8 h-full">
      <Container className="md:!max-w-6xl">
        <Hero.Small
          headline="Contact Us"
          description="For assistance with server selections, pricing, or any support queries, our dedicated team is here for you."
        />
        <div className="mx-auto grid items-start gap-x-8 gap-y-8 md:grid-cols-2 ">
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Contact</h3>
            <p className="mt-1 text-slate-600">
              For general inquiries, please contact us at the email address below.
            </p>
            <p className="mt-4 text-blue-700">
              <a href="mailto:contact@jetkvm.com">contact@jetkvm.com</a>
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Support</h3>
            <p className="mt-1 text-slate-600">Need help or have questions?</p>
            <hr className="my-4 block border-slate-800/20" />

            <div className="flex items-center gap-x-2">
              <LinkButton
                to="/docs/getting-started/troubleshooting"
                size="MD"
                theme="light"
                text="Troubleshooting"
              />
              <div>
                <LinkButton
                  to="https://jetkvm.com/discord"
                  size="MD"
                  theme="light"
                  text="Discord Server"
                  LeadingIcon={DiscordIcon}
                />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Sales</h3>
            <p className="mt-1 text-slate-600">
              Interested in large quantities, data-center KVM form factors or re-selling. Let's discuss how we can meet
              your specific requirements.
            </p>
            <p className="mt-4 text-blue-700">
              <a href="mailto:sales@jetkvm.com">sales@jetkvm.com</a>
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Press</h3>
            <p className="mt-1 text-slate-600">
              For press inquiries, please contact us at the email address below.
            </p>
            <p className="mt-4 text-blue-700">
              <a href="mailto:press@jetkvm.com">press@jetkvm.com</a>
            </p>
            <hr className="mt-4 block border-slate-800/20" />
            <LinkButton
              to="https://drive.google.com/drive/folders/1KGj4tcjIwXfV0Phuos-WlSZW5At8JnUD?usp=drive_link"
              size="MD"
              theme="light"
              text="Download Press Kit"
              className="mt-4"
            />
          </Card>
        </div>
      </Container>
    </div>
  );
}
