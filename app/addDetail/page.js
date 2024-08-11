"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";

export default function DonorRegistrationForm() {
  const [aadhar, setAadhar] = useState("");
  const [organisation, setOrganisation] = useState("individual");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donorData = {
      name,
      aadhar,
      organisation,
      address,
      role: "donor",
    };

    try {
      const response = await axios.post("/api/users", donorData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to register donor");
      }

      alert("Donor registered successfully");
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center align-middle">
      <Card className="card">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">Update Detail</p>
            <p className="text-small text-default-500">
              Join us in making a difference by donating surplus food.
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="m-10">
          <form
            className="flex flex-col align-middle gap-3 p-10"
            onSubmit={handleSubmit}
          >
            <Input
              isClearable
              isRequired
              label="Name"
              variant="bordered"
              description="Enter your full name."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-xs"
            />
           
            <Input
              isClearable
              isRequired
              label="Aadhar Number"
              variant="bordered"
              description="Enter your Aadhar number."
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              label="Organisation"
              variant="bordered"
              description="Enter your organisation name (if applicable)."
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              className="max-w-xs"
            />
            <Textarea
              label="Address"
              placeholder="Enter your address."
              variant="bordered"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="max-w-xs"
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button color="primary" type="submit">
              update detail
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>Thank you for your generosity and support!</p>
        </CardFooter>
      </Card>
    </div>
  );
}
