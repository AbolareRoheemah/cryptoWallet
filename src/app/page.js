"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, Send, RotateCw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [restoreEntropy, setRestoreEntropy] = useState('');
  const { toast } = useToast();


  // try {
  //   setLoading(true);
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   const signer = await provider.getSigner();
  //   // Add your contract address here
  //   const contractAddress = "YOUR_CONTRACT_ADDRESS";
  //   const contract = new ethers.Contract(contractAddress, [
  //     "function createNewWallet() external returns (bytes32)",
  //     "function getWalletDetails() external view returns (bytes32, address, uint256, bool, uint256)",
  //     "function sendEther(address, uint256) external",
  //     "function restoreWallet(bytes32) external"
  //   ], signer);
    
  //   const details = await contract.getWalletDetails();
  //   setWalletDetails({
  //     entropy: details[0],
  //     address: details[1],
  //     createdAt: new Date(details[2] * 1000),
  //     isActive: details[3],
  //     balance: ethers.formatEther(details[4])
  //   });
  // } catch (error) {
  //   toast({
  //     title: "Error connecting wallet",
  //     description: error.message,
  //     variant: "destructive"
  //   });
  // } finally {
  //   setLoading(false);
  // }

const createNewWallet = async () => {
  try {
    setLoading(true);
    // Contract interaction code here
    toast({
      title: "Wallet Creation Initiated",
      description: "Please wait for the transaction to be confirmed.",
    });
  } catch (error) {
    toast({
      title: "Error creating wallet",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

const restoreWalletWithEntropy = async () => {
  try {
    setLoading(true);
    // Contract interaction code here
    toast({
      title: "Wallet Restored",
      description: "Your wallet has been successfully restored.",
    });
  } catch (error) {
    toast({
      title: "Error restoring wallet",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

const sendTransaction = async () => {
  try {
    setLoading(true);
    // Contract interaction code here
    toast({
      title: "Transaction Sent",
      description: "Your transaction has been submitted.",
    });
  } catch (error) {
    toast({
      title: "Error sending transaction",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Wallet Manager
        </CardTitle>
        <CardDescription>
          Create, restore, and manage your blockchain wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!walletDetails ? (
          <div className="space-y-4">
            <Button 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Connect Wallet"
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or create new
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={createNewWallet}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Wallet
            </Button>

            <div className="space-y-2">
              <Input
                placeholder="Enter entropy to restore wallet"
                value={restoreEntropy}
                onChange={(e) => setRestoreEntropy(e.target.value)}
              />
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={restoreWalletWithEntropy}
                disabled={loading || !restoreEntropy}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Restore Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertTitle>Wallet Connected</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong>Address:</strong> {walletDetails.address}</p>
                  <p><strong>Balance:</strong> {walletDetails.balance} ETH</p>
                  <p><strong>Created:</strong> {walletDetails.createdAt.toLocaleDateString()}</p>
                  <p className="break-all"><strong>Entropy:</strong> {walletDetails.entropy}</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Recipient address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Amount in ETH"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
              <Button 
                className="w-full"
                onClick={sendTransaction}
                disabled={loading || !sendAmount || !recipientAddress}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Transaction
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500 text-center">
        This is just a test wallet. Make use of popular wallet providers for security purposes
      </CardFooter>
    </Card>
  </div>
)
}
