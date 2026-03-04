package com.swd.paymentservice.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CallbackResult {
    private boolean validSignature;
    private boolean success;
    private String txnRefCode;
    private String gatewayTxnId;
    private String responseCode;
}
