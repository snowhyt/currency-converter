"use client";

import { useState, useEffect, ChangeEvent } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type ExchangeRates = {
    [key: string]: number;
};

type Currency = "USD" | "KRW" | "EUR" | "JPY" | "GBP" | "AUD" | "PKR" | "PHP";



export default function CurrencyConverter() {

    //react hooks 'useStates'

    const [amount, setAmount] = useState<number | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Currency>("PHP");
    const [toCurrency, setToCurrency] = useState<Currency>("KRW");
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
    const [convertedAmount, setConvertedAmount] = useState<string>("0.00");


    //other hooks 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);



    //useEffect in fetching the api exchange rates

    useEffect(() => {
        const fetchExchangeRates = async () => {
            setLoading(true);
            setError(null);

            try {
                //api
                const response = await fetch(
                    "https://api.exchangerate-api.com/v4/latest/PHP"
                );
                const data = await response.json();
                setExchangeRates(data.rates);

            } catch (error) {
                setError(`${error}. Error in fetching exchange rates.`)

            } finally {
                setLoading(false);
            }
        }; fetchExchangeRates();
    }, []);



    // handle changes in amount input field
    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAmount(parseFloat(e.target.value));
    };

    //function that handles exchanges in "FROM" currency
    const handleSFromCurrencyChange = (value: Currency): void => {
        setFromCurrency(value);
    };

    //function that handles exchanges in "TO" currency
    const handleToCurrencyChange = (value:Currency): void => {
        setToCurrency(value);
    }


    //function that calculates the exchange
    const calculatedConvertedAmount = (): void => { 
        if (fromCurrency && toCurrency && amount && exchangeRates) {
            const rate =
                fromCurrency === "PHP" ? exchangeRates[toCurrency]
                    : exchangeRates[toCurrency] / exchangeRates[fromCurrency];

            const result = amount * rate;
            setConvertedAmount(result.toFixed(2)); 
        }
    };


    //function that clears input
    function handleReset(){
            setConvertedAmount("0.00");
            setAmount(null);
    };
    

    //returns content in webpage
    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Currency Converter App</CardTitle>
                <CardDescription>Select Currency. Enter Amount. Click Convert.</CardDescription>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex justify-center">
                        <ClipLoader className="w-6 h-6 text-blue-500" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <form>
                        <div className="grid w-full items-center gap-4">
                               {/*Select Items*/}
                            <div className="flex flex-col space-y-1.5">

                                <div className="flex flex-wrap justify-between items-center ">
                                    
                                        <Select
                                        
                                        value={fromCurrency}
                                        onValueChange={handleSFromCurrencyChange}
                                        >
                                            <SelectTrigger className="w-50">
                                                <SelectValue placeholder="PHP" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="KRW">KRW</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                                <SelectItem value="JPY">JPY</SelectItem>
                                                <SelectItem value="AUD">AUD</SelectItem>
                                                <SelectItem value="CAD">CAD</SelectItem>
                                                <SelectItem value="PKR">PKR</SelectItem>
                                                <SelectItem value="PHP">PHP</SelectItem>


                                            </SelectContent>
                                        </Select>
                                   
                                        <div>
                                            <span>To</span>
                                        </div>
                                   




                                      {/*Select Items*/}
                                        <Select
                                        value={toCurrency}
                                        onValueChange={handleToCurrencyChange}
                                        >
                                           
                                            <SelectTrigger className="w-50">
                                                <SelectValue placeholder="KRW" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="KRW">KRW</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                                <SelectItem value="JPY">JPY</SelectItem>
                                                <SelectItem value="AUD">AUD</SelectItem>
                                                <SelectItem value="CAD">CAD</SelectItem>
                                                <SelectItem value="PKR">PKR</SelectItem>
                                                <SelectItem value="PHP">PHP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                </div>

                                <div className="pt-3">

                                    <div className="flex flex-col space-y-1.5">
                                      {/*Input Items*/}
                                        <Label htmlFor="from">Enter Amount:</Label>
                                        <Input 
                                            type="number"
                                            placeholder="Amount"
                                            value={amount || ""}
                                            onChange={handleAmountChange}
                                            id="from" 
                                        />
                                    </div>
                                </div>


                                <div className="pt-3">

                                    <div className="flex flex-col space-y-1.5">
                                     {/*Input Items*/}
                                        <Label htmlFor="convertedAmount">Computed Result:</Label>
                                        <div className="text-2xl font-bold">{convertedAmount} <span className="text-lg font-medium text-black opacity-30">{toCurrency}</span></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )
                }

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button 
                variant="outline"
                onClick={handleReset}
                
                
                
                >Clear</Button>
                <Button
                type="button"
                onClick={calculatedConvertedAmount}
                >Convert</Button>
            </CardFooter>

        </Card>










    )
};