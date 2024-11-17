"use client"
import React, { useState, useEffect } from 'react';
import { ethers, JsonRpcProvider } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, Send, RotateCw, Plus, Clipboard, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { createNewAccount } from "@/hooks/01_newAccount";
// import { restoreWallet } from "@/hooks/02_restoreWallet";

const NETWORKS = {
  mainnet: {
      name: "mainnet",
      rpc: "https://eth-mainnet.g.alchemy.com/v2/pF73OKLX-JtPajzCzU5IrSkSqylsHumo",  // Replace with your API key
      chainId: 1
  },
  sepolia: {
      name: "sepolia",
      rpc: "https://eth-sepolia.g.alchemy.com/v2/pF73OKLX-JtPajzCzU5IrSkSqylsHumo",  // Replace with your API key
      chainId: 11155111
  },
  localhost: {
      name: "localhost",
      rpc: "http://127.0.0.1:8545",
      chainId: 31337
  }
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [restoreEntropy, setRestoreEntropy] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(NETWORKS.localhost);
  const [accountDetails, setAccountDetails] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { toast } = useToast();

  const getProvider = () => {
    return new JsonRpcProvider(currentNetwork.rpcUrl);
  };

  // Fetch account details
  const fetchAccountDetails = async (address) => {
    try {
      const provider = getProvider();
      const balance = await provider.getBalance(address);
      const networkName = await provider.getNetwork().then(net => net.name);
      
      setAccountDetails({
        address,
        balance: ethers.formatEther(balance), // Convert from wei to ETH
        network: networkName
      });
    } catch (error) {
      console.error('Error fetching account details:', error);
      toast({
        title: "Error fetching account details",
        description: error.message,
        variant: "destructive"
      });
    }
  };

   // Load stored accounts
   const loadStoredAccounts = () => {
    try {
      // Get accounts from localStorage
      const storedAccounts = JSON.parse(localStorage.getItem('wallet_accounts') || '[]');
      setAccounts(storedAccounts);
      
      // Set first account as current if available
      if (storedAccounts.length > 0 && !currentAccount) {
        setCurrentAccount(storedAccounts[0]);
        fetchAccountDetails(storedAccounts[0]);
      }
    } catch (error) {
      console.error('Error loading stored accounts:', error);
    }
  };
  // Load accounts on component mount
  useEffect(() => {
    loadStoredAccounts();
  }, []);

  const createNewWallet = async () => {
    try {
      setLoading(true);
      toast({
        title: "Wallet Creation Initiated",
        description: "Please wait for the transaction to be confirmed.",
      });
      const { mnemonic, address } = await createNewAccount();
      // Store address in localStorage
      const updatedAccounts = [...accounts, address];
      localStorage.setItem('wallet_accounts', JSON.stringify(updatedAccounts));
      
      // Update state
      setAccounts(updatedAccounts);
      setCurrentAccount(address);
      setMnemonic(mnemonic);
      setShowMnemonic(true);
      
      // Fetch account details
      await fetchAccountDetails(address);
      // console.log("in app", mnemonic, address)

      toast({
        title: "Wallet Creation Successful",
        description: "Your wallet has been created successfully.",
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


  // Handle network switch
  const handleNetworkSwitch = async (networkKey) => {
    try {
      setCurrentNetwork(NETWORKS[networkKey]);
      if (currentAccount) {
        await fetchAccountDetails(currentAccount);
      }
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: "Error switching network",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle account switch
  const handleAccountSwitch = async (address) => {
    setCurrentAccount(address);
    await fetchAccountDetails(address);
  };

  const restoreWalletWithEntropy = async () => {
    try {
      setLoading(true);
      const { address } = await restoreWallet(restoreEntropy);
      setCurrentAccount(address);
      setAccounts(prevAccounts => [...prevAccounts, address]);
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

  const copyMnemonicToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    toast({
      title: "Mnemonic Copied",
      description: "Your mnemonic has been copied to the clipboard.",
    });
  };

  const closeMnemonicView = () => {
    setShowMnemonic(false);
    setMnemonic(''); // Clear mnemonic from state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Wallet Manager
            </CardTitle>
            <CardDescription>
              Create, restore, and manage your blockchain wallet
            </CardDescription>
            </div>
            {/* Dropdown for accounts on top */}

            {/* Network Selector */}
            <Select 
              value={currentNetwork.name}
              onValueChange={(value) => handleNetworkSwitch(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(NETWORKS).map((key) => (
                  <SelectItem key={key} value={key}>
                    {NETWORKS[key].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <div className="space-y-2">
              <select id="accounts" className="rounded-md p-2 w-28" onChange={(e) => setCurrentAccount(e.target.value)}>
                <option value="">Accounts</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account}>{account}</option>
                ))}
              </select>
            </div> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Details Card */}
          {currentAccount && !showMnemonic && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Current Account</p>
                      <p className="font-mono text-sm break-all">{currentAccount}</p>
                    </div>
                    
                    {/* Account Selector */}
                    <Select
                      value={currentAccount}
                      onValueChange={handleAccountSwitch}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account, index) => (
                          <SelectItem key={account} value={account}>
                            Account {index + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-medium">{accountDetails?.balance ?? '0'} ETH</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {currentNetwork.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!showMnemonic ? (
            <div className="space-y-4">
              <Button 
                className="w-full"
                disabled={loading}
                onClick={createNewWallet}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create New Account"
                )}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or restore
                  </span>
                </div>
              </div>

              {/* <Button 
                variant="outline" 
                className="w-full"
                onClick={createNewWallet}
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Account
              </Button> */}

              <div className="space-y-2">
                <Input
                  placeholder="Enter see to restore wallet"
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
                <AlertTitle>Wallet Created</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Address:</strong> {currentAccount}</p>
                    <div>
                      <strong>Mnemonic:</strong>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {mnemonic.split(' ').map((word, index) => (
                          <span key={index} className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center text-sm font-medium">
                            {word}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-orange-500 text-sm">
                        **Keep this phrase secure. It will not be displayed again.**
                      </p>
                      <div className='flex gap-4'>
                      <Button 
                        className="mt-2"
                        onClick={copyMnemonicToClipboard}
                      >
                        <Clipboard className="mr-2 h-4 w-4" />
                        Copy Mnemonic
                      </Button>
                      <Button 
                        className="mt-2"
                        onClick={closeMnemonicView}
                      >
                        Close
                      </Button>
                      </div>
                    </div>
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
