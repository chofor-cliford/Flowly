import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "../ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, []);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    const { data } = await axios.post(
      `http://localhost:8080/api/v1/checkoutCredits`,
      { transaction },
      {
        headers: {
          "Content-Type": "application/json", // Corrected content type
        },
      }
    );

    if (data) {
      window.location.href = data.url;
    }
  };

  return (
    <form onSubmit={onCheckout}>
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
