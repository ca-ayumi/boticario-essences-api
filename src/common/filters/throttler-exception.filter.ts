import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ThrottlerExceptionFilter.name);

    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.TOO_MANY_REQUESTS;
        const message = exception.message || 'Too Many Requests';

        this.logger.error(`ThrottlerException: ${message}`);

        response
            .status(status)
            .json({
                statusCode: status,
                message: `ThrottlerException: ${message}`,
            });
    }
}
