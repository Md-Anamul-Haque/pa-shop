import SaleReturnHandler from "@/components/component/sales-return";
import SalesVendorInfo_input from "@/components/component/sales/sales&VendorInfo_input";
import { purchaseSlice, salesReturn_Slice, selectSalesReturn, useDispatch, useSelector } from "@/lib/redux";
import { customerType } from "@/types/tables.type";
import { Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
const steps = [
    'Select Customer',
    'makes lists',
];

const SalesReturnPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const { customer } = useSelector(selectSalesReturn);
    const setCustomer = (customer: customerType) => {
        dispatch(salesReturn_Slice.actions.setCustomer(customer));
    };
    return (
        <div className="my-5 grid">
            <div className="overflow-auto">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, i) => (
                        <Step key={label}>
                            <StepLabel>
                                {activeStep == i ? <span className="hidden sm:inline-block">{label}</span> : <span className="hidden md:inline-block">{label}</span>}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            {activeStep === 0 && <SalesVendorInfo_input customer={customer} onSaveChange={setCustomer} onNext={incre => setActiveStep(activeStep + incre)} />}
            {activeStep === 1
                && <div className="w-full h-full overflow-auto flex">
                    <div className="hidden lg:inline-block mr-20 bg-slate-500  w-52">

                    </div>
                    <SaleReturnHandler
                        onSubmited={() => {
                            dispatch(purchaseSlice.actions.clearPurchase())
                            setActiveStep(0)
                        }}
                        onNext={incre => setActiveStep(activeStep + incre)} />
                    <div className="hidden lg:inline-block w-44">

                    </div>
                </div>}
            {/* {activeStep === 2 && <>
                <MTdataInput onSubmited={() => {
                    dispatch(purchaseSlice.actions.clearPurchase())
                    setActiveStep(0)
                }} onNext={incre => setActiveStep(activeStep + incre)} />
            </>} */}
        </div>
    )
}
export default SalesReturnPage;
