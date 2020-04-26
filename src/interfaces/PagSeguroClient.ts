import SessionService from '../services/SessionService';
import InstallmentService from '../services/InstallmentService';

export interface PagSeguroClient {
  sessionService: SessionService;
  installmentService: InstallmentService;
}
