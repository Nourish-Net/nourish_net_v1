"use client";
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
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserCreation() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [aadhar, setAadhar] = useState("");
  const [organisation, setOrganisation] = useState("individual");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const checkUserExists = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if user already exists in the database
          const checkResponse = await axios.get(
            `/api/users/check?clerkId=${user.id}`
          );

          if (checkResponse.data.exists) {
            console.log("User already exists.");
            setUserExists(true); // Set userExists to true if the user already exists
            setName(checkResponse.data.name || user.fullName);
          } else {
            console.log("User does not exist, showing form for creation.");
            setUserExists(false); // Show form if user does not exist
          }
        } catch (error) {
          console.error("Error checking user:", error);
        }
      }
    };

    checkUserExists();
  }, [isLoaded, isSignedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !aadhar || !address) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setError(""); // Clear any previous errors

      // Prepare user data from form input
      const userData = {
        name: name || "", // Use name from form or an empty string
        email: user.primaryEmailAddress?.emailAddress || "",
        phoneNo: user.primaryPhoneNumber?.phoneNumber || "", // Handle this if available
        aadhar: aadhar,
        organisation: organisation, // Handle this if available
        address: address, // Handle this if available
        clerkId: user.id,
      };

      // Make a POST request to your API to create a user
      const createResponse = await axios.post(
        "/api/users/new",
        userData
      );

      if (createResponse.data.success) {
        console.log("User created successfully:", createResponse.data.user);
        setUserExists(true); // Set userExists to true after creation
      } else {
        setError(createResponse.data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("An error occurred while creating your account.");
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>; // Or some other loading state
  }

  if (userExists) {
    return (
      <div className="flex justify-center align-middle">
        <Card className="card">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md font-bold">Welcome Back!</p>
              <p className="text-small text-default-500">
                Hi, {name}. Thank you for your continued support!
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center align-middle">
      <Card className="card">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">Create Account</p>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button color="primary" type="submit">
              Create Account
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
